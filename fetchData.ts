import zod from "zod";
import fastq from "fastq";

import { translationValidator } from "./src/books";

const langsResponseValidator = zod.object({
  response: zod.object({
    data: zod.object({
      default_versions: zod.array(
        zod.object({
          iso_639_3: zod.string().length(3),
          // This is SUPPOSED to be just 2 letters, but YouVersion has dirty
          // data and one of the records includes an ISO language code (ku_IQ)
          iso_639_1: zod
            .union([
              zod.string().length(2),
              zod.string().regex(/^[a-z]{2}_[A-Z]{2}$/),
            ])
            .nullable(),
          language_tag: zod.string(),
          local_name: zod.string(),
          text_direction: zod.enum(["ltr", "rtl"]),
          name: zod.string(),
          id: zod.number().int().positive().nullable(),
          has_audio: zod.boolean(),
          has_text: zod.boolean(),
          font: zod.string().nullable(),
          total_versions: zod.number().int().nonnegative(),
        })
      ),
    }),
  }),
});

const allTranslations: zod.infer<typeof translationValidator>[] = [];

const fetchTranslationsForLang = async (lang: string) => {
  try {
    const response = await fetch(
      `https://www.bible.com/api/bible/versions?language_tag=${lang}&type=all`
    );
    const translations = (await response.json()).response.data.versions;
    for (const translation of translations) {
      allTranslations.push(translationValidator.parse(translation));
    }
    console.log("Finished fetching language", lang);
  } catch (ex) {
    console.error(ex);
    throw ex;
  }
};

const queue = fastq.promise(fetchTranslationsForLang, 15);

(async () => {
  const langsResponse = await (
    await fetch("https://www.bible.com/api/bible/configuration")
  ).json();
  const langs =
    langsResponseValidator.parse(langsResponse).response.data.default_versions;

  langs
    //.slice(0, 3)
    .map((lang) => lang.iso_639_3)
    .filter((lang) => lang === "eng")
    .forEach((lang) => queue.push(lang));

  await queue.drained();

  console.log("Writing translations.json");
  Bun.write("translations.json", JSON.stringify(allTranslations));
})();
