import en from "./en.json";
import it from "./it.json";

const dictionaries = { en, it };

export type Locale = keyof typeof dictionaries;

function detectLocale(): Locale {
  const lang = typeof navigator !== "undefined" ? navigator.language.slice(0, 2) : "en";
  return lang in dictionaries ? (lang as Locale) : "en";
}

export const locale: Locale = detectLocale();
export const dictionary = dictionaries[locale];
