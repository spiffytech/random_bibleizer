import { ref, watchEffect } from 'vue';
import { defineStore } from 'pinia';

import type { Ref } from 'vue';

import { translations, bookRanges } from '../books';

import type { BooksRange } from '../books';

// Mobile Safari disables LocalStorage when "block all cookies" is enabled
const canUseLocalstorage = (() => {
  try {
    localStorage.getItem('bogus');
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

const persistentLocalStorageValue = <T>(key: string, defaultValue: T): Ref<T> => {
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

export default defineStore('configuration', () => {
  const weightBooksEvenly = ref(persistentLocalStorageValue('weightBooksEvenly', true));

  const savedTranslationAbbr = persistentLocalStorageValue('savedTranslation', 'GW').value;
  const translation = ref(translations.find((t) => t.abbreviation === savedTranslationAbbr)!);

  const openInBibleAppAutomatically = persistentLocalStorageValue(
    'openInBibleAppAutomatically',
    false
  );
  // Ughhhh we put a typo in prod and now we have to support it
  const typoedValue = localstorageTryGet('openInBibleAppAuotmatically');
  if (typoedValue) {
    openInBibleAppAutomatically.value = typoedValue === 'true';
    localstorageTryDelete('openInBibleAppAuotmatically');
  }

  const selectedBookRange = ref(bookRanges[0]) as Ref<BooksRange>;

  return {
    weightBooksEvenly,
    translation,
    openInBibleAppAuotmatically: openInBibleAppAutomatically,
    selectedBookRange
  };
});
