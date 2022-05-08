import { SelectOption } from 'src/type';

export const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: 'en-US', label: 'English' },
  // { value: 'ar', label: 'العربية' },
  // { value: 'cs', label: 'Český Jazyk' },
  // { value: 'da', label: 'Dansk' },
  // { value: 'de', label: 'Deutsch' },
  // { value: 'el', label: 'Ελληνικά' },
  // { value: 'es-AR', label: 'Español (Argentina)' },
  // { value: 'es-ES', label: 'Español (España)' },
  // { value: 'fr', label: 'Français' },
  // { value: 'hu', label: 'Magyar' },
  // { value: 'id', label: 'Bahasa Indonesia' },
  // { value: 'is', label: 'Íslenska' },
  // { value: 'it-IT', label: 'Italiano' },
  // { value: 'ja', label: '日本語' },
  // { value: 'ko', label: '한국어' },
  // { value: 'nb', label: 'Norsk' },
  // { value: 'nl', label: 'Nederlands' },
  // { value: 'pl', label: 'Polski' },
  // { value: 'pt-BR', label: 'Português (Brasil)' },
  // { value: 'ru', label: 'Русский' },
  // { value: 'sr', label: 'Српски' },
  // { value: 'tr', label: 'Türkçe' },
  // { value: 'uk-UA', label: 'український' },
  { value: 'zh-CN', label: '中文 (天朝)' },
  // { value: 'zh-TW', label: '中文 (台灣)' },
];

export enum CddaBranch {
  experimental,
  stable,
}

export enum BreathabilityRating {
  IMPERMEABLE = 0,
  POOR = 30,
  AVERAGE = 50,
  GOOD = 80,
  MOISTURE_WICKING = 110,
  SECOND_SKIN = 140,
  last = 0,
}
