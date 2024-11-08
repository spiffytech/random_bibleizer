import { translationValidator } from './src/books';

(async () => {
  const response = await fetch(
    'https://www.bible.com/api/bible/versions?language_tag=eng&type=all'
  );
  const translations = (await response.json()).response.data.versions;
  for (const translation of translations) {
    translationValidator.parse(translation);
  }
  console.log('translations', translations);
  Bun.write('translations.json', JSON.stringify(translations));
})();
