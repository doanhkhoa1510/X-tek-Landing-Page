/* Markdown under src/content/<collection>/<locale>/ links to site pages as "/privacy-policy/"; in a translated file
   those links take the locale's prefix ("/vi/privacy-policy/"), so a reader stays in their language. */

/** @param {{ locales: readonly { code: string, path: string }[], defaultLocale: string }} options */
export default function rehypeLocalizeLinks({ locales, defaultLocale }) {
  const prefixes = locales.filter((l) => l.code !== defaultLocale).map((l) => l.path);
  return (tree, file) => {
    const code = /\/src\/content\/[^/]+\/([^/]+)\//.exec(file.path ?? "")?.[1];
    const path = locales.find((l) => l.code === code && l.code !== defaultLocale)?.path;
    if (!path) return;
    const walk = (node) => {
      const href = node.tagName === "a" ? node.properties?.href : undefined;
      if (typeof href === "string" && href.startsWith("/") && !href.startsWith("//") && !prefixes.some((p) => href === `/${p}` || href.startsWith(`/${p}/`))) {
        node.properties.href = `/${path}${href}`;
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
