export function toCourseSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[()]/g, "")
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
