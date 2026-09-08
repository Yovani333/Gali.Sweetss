export default function PreviewImage({ src, thumbnail, thumbnailSmall, alt, onPreview }) {
  return (
    <button
      className="image-preview-trigger"
      type="button"
      aria-label={`Ampliar imagen: ${alt}`}
      aria-haspopup="dialog"
      onClick={(event) => {
        const img = event.currentTarget.querySelector('img');
        if (img.naturalWidth) {
          onPreview({ src, alt, width: img.naturalWidth, height: img.naturalHeight });
        }
      }}
    >
      <img
        src={thumbnail || src}
        srcSet={thumbnailSmall && thumbnail ? `${thumbnailSmall} 360w, ${thumbnail} 720w` : undefined}
        sizes="(max-width: 560px) 92vw, (max-width: 1024px) 44vw, 260px"
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </button>
  );
}
