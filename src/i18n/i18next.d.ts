/* Typed keys: t() accepts only keys the English files define, per namespace. Add each new namespace here. */
import "i18next";
import type camps from "./locales/en/camps.json";
import type common from "./locales/en/common.json";
import type faq from "./locales/en/faq.json";
import type footer from "./locales/en/footer.json";
import type form from "./locales/en/form.json";
import type header from "./locales/en/header.json";
import type hero from "./locales/en/hero.json";
import type home from "./locales/en/home.json";
import type loader from "./locales/en/loader.json";
import type mindset from "./locales/en/mindset.json";
import type platform from "./locales/en/platform.json";
import type site from "./locales/en/site.json";
import type summit from "./locales/en/summit.json";
import type values from "./locales/en/values.json";
import type work from "./locales/en/work.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      camps: typeof camps;
      common: typeof common;
      faq: typeof faq;
      footer: typeof footer;
      form: typeof form;
      header: typeof header;
      hero: typeof hero;
      home: typeof home;
      loader: typeof loader;
      mindset: typeof mindset;
      platform: typeof platform;
      site: typeof site;
      summit: typeof summit;
      values: typeof values;
      work: typeof work;
    };
  }
}
