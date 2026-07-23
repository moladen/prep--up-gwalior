export function toEmbedVideoUrl(url) {
  if (!url?.trim()) return "";
  const trimmed = url.trim();
  if (trimmed.includes("/embed/")) return trimmed;
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return trimmed;
}
