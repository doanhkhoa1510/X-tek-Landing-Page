/* Markdown mailto links are wrapped in <!--email_off--> comments so Cloudflare's email obfuscation leaves them alone,
   the same as the email links in the components. */

/** @param {unknown} node */
export default function rehypeEmailOff() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.flatMap((child) => {
        walk(child);
        const href = child.tagName === "a" ? child.properties?.href : undefined;
        if (typeof href !== "string" || !href.startsWith("mailto:")) return [child];
        return [{ type: "comment", value: "email_off" }, child, { type: "comment", value: "/email_off" }];
      });
    };
    walk(tree);
  };
}
