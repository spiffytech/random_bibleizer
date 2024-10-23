import zod from 'zod';

export const translationValidator = zod.object({
  id: zod.number(),
  abbreviation: zod.string(),
  local_abbreviation: zod.string(),
  title: zod.string(),
  local_title: zod.string(),
  audio: zod.boolean(),
  audio_count: zod.number().min(0),
  text: zod.boolean(),
  language: zod.object({
    iso_639_1: zod.string().length(2),
    iso_639_3: zod.string().length(3),
    name: zod.string(),
    local_name: zod.string(),
    text_direction: zod.union([zod.literal('ltr'), zod.literal('rtl')]),
    language_tag: zod.string().length(3),
    secondary_language_tags: zod.any().nullable()
  }),
  publisher_id: zod.any().nullable(),
  platforms: zod.object({
    android: zod.boolean(),
    blackberry: zod.boolean(),
    facebook: zod.boolean(),
    ios: zod.boolean(),
    win8: zod.boolean(),
    wp7: zod.boolean()
  }),
  metadata_build: zod.number().min(0),
  vrs: zod.string().length(3).nullable()
});

export type Translation = zod.infer<typeof translationValidator>;

import translations_ from '../translations.json';
const translations = translations_ as Translation[];
export { translations };

export const books = [
  { human: 'Genesis', abbr: 'GEN', chapters: 50 },
  { human: 'Exodus', abbr: 'EXO', chapters: 40 },
  { human: 'Leviticus', abbr: 'LEV', chapters: 27 },
  { human: 'Numbers', abbr: 'NUM', chapters: 36 },
  { human: 'Deuteronomy', abbr: 'DEU', chapters: 34 },
  { human: 'Joshua', abbr: 'JOS', chapters: 24 },
  { human: 'Judges', abbr: 'JDG', chapters: 21 },
  { human: 'Ruth', abbr: 'RUT', chapters: 4 },
  { human: '1 Samuel', abbr: '1SA', chapters: 31 },
  { human: '2 Samuel', abbr: '2SA', chapters: 24 },
  { human: '1 Kings', abbr: '1KI', chapters: 22 },
  { human: '2 Kings', abbr: '2KI', chapters: 25 },
  { human: '1 Chronicles', abbr: '1CH', chapters: 29 },
  { human: '2 Chronicles', abbr: '2CH', chapters: 36 },
  { human: 'Ezra', abbr: 'EZR', chapters: 10 },
  { human: 'Nehemiah', abbr: 'NEH', chapters: 13 },
  { human: 'Esther', abbr: 'EST', chapters: 10 },
  { human: 'Job', abbr: 'JOB', chapters: 42 },
  { human: 'Psalms', abbr: 'PSA', chapters: 150 },
  { human: 'Proverbs', abbr: 'PRO', chapters: 31 },
  { human: 'Ecclesiastes', abbr: 'ECC', chapters: 12 },
  { human: 'Song of Solomon', abbr: 'SNG', chapters: 8 },
  { human: 'Isaiah', abbr: 'ISA', chapters: 66 },
  { human: 'Jeremiah', abbr: 'JER', chapters: 52 },
  { human: 'Lamentations', abbr: 'LAM', chapters: 5 },
  { human: 'Ezekiel', abbr: 'EZK', chapters: 48 },
  { human: 'Daniel', abbr: 'DAN', chapters: 12 },
  { human: 'Hosea', abbr: 'HOS', chapters: 14 },
  { human: 'Joel', abbr: 'JOL', chapters: 3 },
  { human: 'Amos', abbr: 'AMO', chapters: 9 },
  { human: 'Obadiah', abbr: 'OBA', chapters: 1 },
  { human: 'Jonah', abbr: 'JON', chapters: 4 },
  { human: 'Micah', abbr: 'MIC', chapters: 7 },
  { human: 'Nahum', abbr: 'NAM', chapters: 3 },
  { human: 'Habakkuk', abbr: 'HAB', chapters: 3 },
  { human: 'Zephaniah', abbr: 'ZEP', chapters: 3 },
  { human: 'Haggai', abbr: 'HAG', chapters: 2 },
  { human: 'Zechariah', abbr: 'ZEC', chapters: 14 },
  { human: 'Malachi', abbr: 'MAL', chapters: 4 },
  { human: 'Matthew', abbr: 'MAT', chapters: 28 },
  { human: 'Mark', abbr: 'MRK', chapters: 16 },
  { human: 'Luke', abbr: 'LUK', chapters: 24 },
  { human: 'John', abbr: 'JHN', chapters: 21 },
  { human: 'Acts', abbr: 'ACT', chapters: 28 },
  { human: 'Romans', abbr: 'ROM', chapters: 16 },
  { human: '1 Corinthians', abbr: '1CO', chapters: 16 },
  { human: '2 Corinthians', abbr: '2CO', chapters: 13 },
  { human: 'Galatians', abbr: 'GAL', chapters: 6 },
  { human: 'Ephesians', abbr: 'EPH', chapters: 6 },
  { human: 'Philippians', abbr: 'PHP', chapters: 4 },
  { human: 'Colossians', abbr: 'COL', chapters: 4 },
  { human: '1 Thessalonians', abbr: '1TH', chapters: 5 },
  { human: '2 Thessalonians', abbr: '2TH', chapters: 3 },
  { human: '1 Timothy', abbr: '1TI', chapters: 6 },
  { human: '2 Timothy', abbr: '2TI', chapters: 4 },
  { human: 'Titus', abbr: 'TIT', chapters: 3 },
  { human: 'Philemon', abbr: 'PHM', chapters: 1 },
  { human: 'Hebrews', abbr: 'HEB', chapters: 13 },
  { human: 'James', abbr: 'JAS', chapters: 5 },
  { human: '1 Peter', abbr: '1PE', chapters: 5 },
  { human: '2 Peter', abbr: '2PE', chapters: 3 },
  { human: '1 John', abbr: '1JN', chapters: 5 },
  { human: '2 John', abbr: '2JN', chapters: 1 },
  { human: '3 John', abbr: '3JN', chapters: 1 },
  { human: 'Jude', abbr: 'JUD', chapters: 1 },
  { human: 'Revelation', abbr: 'REV', chapters: 22 }
];

export const bookRanges: BooksRange[] = [
  { name: 'Whole Bible', range: [0, 66] },
  { name: 'Old Testament', range: [0, 39] },
  { name: 'New Testament', range: [39, 66] },
  { name: 'Psalms and Proverbs', range: [18, 20] }
];

export type Book = (typeof books)[number];

export type Passage = { book: Book; chapter: number };

export interface BooksRange {
  name: string;
  range: [number, number];
}
