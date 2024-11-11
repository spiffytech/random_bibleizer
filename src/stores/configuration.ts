import { ref, computed, watchEffect } from "vue";
import { defineStore } from "pinia";

import type { Ref } from "vue";

import { translations, bookRanges } from "../books";

import type { BooksRange } from "../books";

// Mobile Safari disables LocalStorage when "block all cookies" is enabled
const canUseLocalstorage = (() => {
  try {
    localStorage.getItem("bogus");
    return true;
  } catch (ex) {
    return false;
  }
})();

const localstorageTryGet = (key: string) => {
  if (canUseLocalstorage) {
    return localStorage.getItem(key);
  }
  return null;
};
const localstorageTrySet = (key: string, value: string) => {
  if (canUseLocalstorage) {
    return localStorage.setItem(key, value);
  }
};
const localstorageTryDelete = (key: string) => {
  if (canUseLocalstorage) {
    return localStorage.removeItem(key);
  }
};

const persistentLocalStorageValue = <T>(
  key: string,
  defaultValue: T
): Ref<T> => {
  const storedValue = localstorageTryGet(key);
  // No idea why the cast is necessary
  const valueRef = ref(defaultValue) as Ref<T>;
  if (storedValue) {
    try {
      valueRef.value = JSON.parse(storedValue) as T;
    } catch {
      // The old version of the app just stored keys willy-nilly and made every
      // read/write a special snowflake operation.
      valueRef.value = storedValue as T;
    }
  }
  watchEffect(() => localstorageTrySet(key, JSON.stringify(valueRef.value)));
  return valueRef;
};

export default defineStore("configuration", () => {
  const weightBooksEvenly = ref(
    persistentLocalStorageValue("weightBooksEvenly", true)
  );

  // This is an incredibly clumsy way to handle persisting this value, but I
  // don't know what else to do and I don't care enough to make it better.
  // Doesn't matter.
  const savedTranslationAbbr = persistentLocalStorageValue(
    "savedTranslation",
    "GW"
  );
  const translation = ref(
    translations.find(
      (t) => t.local_abbreviation === savedTranslationAbbr.value
    ) ??
      // Fallthrough case covers while we figure out multi-language support, and
      // the downloaded translations file may not include the translation they saved
      translations.find((t) => t.local_abbreviation === "GW")!
  );
  watchEffect(
    () => (savedTranslationAbbr.value = translation.value.local_abbreviation)
  );

  const openInBibleAppAutomatically = persistentLocalStorageValue(
    "openInBibleAppAutomatically",
    false
  );
  // Ughhhh we put a typo in prod and now we have to support it
  const typoedValue = localstorageTryGet("openInBibleAppAuotmatically");
  if (typoedValue) {
    openInBibleAppAutomatically.value = typoedValue === "true";
    localstorageTryDelete("openInBibleAppAuotmatically");
  }

  const selectedBookRange = ref(bookRanges[0]) as Ref<BooksRange>;

  return {
    weightBooksEvenly,
    translation,
    openInBibleAppAuotmatically: openInBibleAppAutomatically,
    selectedBookRange,
  };
});
