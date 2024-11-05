// lib/i18n/server.ts
import { createI18nServer } from "next-international/server";

const locales = {
  en: () => import("../../app/utils/language/en.json"),
  ko: () => import("../../app/utils/language/ko.json"),
  jp: () => import("../../app/utils/language/jp.json"),
  cn: () => import("../../app/utils/language/cn.json"),
  es: () => import("../../app/utils/language/es.json"),
  de: () => import("../../app/utils/language/de.json"),
};

export const { getI18n, getScopedI18n } = createI18nServer(locales);

// lib/i18n/client.ts
