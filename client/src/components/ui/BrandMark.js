/** Official Prep Up logo asset */
export default function BrandMark({ className = "h-10 w-10", alt = "" }) {
  return (
    <img
      src="/logo-mark.webp"
      alt={alt}
      width={96}
      height={96}
      className={`block object-contain object-center ${className}`}
      decoding="async"
    />
  );
}
