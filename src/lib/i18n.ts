import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import common from "@/locales/en/common.json";
import nav from "@/locales/en/nav.json";
import auth from "@/locales/en/auth.json";
import posts from "@/locales/en/posts.json";
import hives from "@/locales/en/hives.json";
import comments from "@/locales/en/comments.json";
import settings from "@/locales/en/settings.json";
import validation from "@/locales/en/validation.json";
import toasts from "@/locales/en/toasts.json";
import enums from "@/locales/en/enums.json";
import a11y from "@/locales/en/a11y.json";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  defaultNS: "common",
  ns: ["common", "nav", "auth", "posts", "hives", "comments", "settings", "validation", "toasts", "enums", "a11y"],
  resources: {
    en: {
      common,
      nav,
      auth,
      posts,
      hives,
      comments,
      settings,
      validation,
      toasts,
      enums,
      a11y,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
