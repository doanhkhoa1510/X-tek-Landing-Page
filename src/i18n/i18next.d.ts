/* Typed keys: t() accepts only keys the English files define, per namespace. Add each new namespace here. */
import "i18next";
import type common from "./locales/en/common.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof common;
    };
  }
}
