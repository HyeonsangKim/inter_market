"use client";
import { createI18nClient } from "next-international/client";

const locales = {
  en: () => import("../../app/utils/language/en.json"),
  ko: () => import("../../app/utils/language/ko.json"),
  jp: () => import("../../app/utils/language/jp.json"),
  cn: () => import("../../app/utils/language/cn.json"),
  es: () => import("../../app/utils/language/es.json"),
  de: () => import("../../app/utils/language/de.json"),
};

export const { useI18n, useScopedI18n, I18nProviderClient } =
  createI18nClient(locales);
