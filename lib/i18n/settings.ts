export const locales = ["en", "ko", "ja", "zh", "es", "de"] as const;
export const defaultLocale = "en";

export type Locale = (typeof locales)[number];
