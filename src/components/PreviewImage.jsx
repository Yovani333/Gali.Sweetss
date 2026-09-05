export default function PreviewImage({ src, alt, onPreview }) {
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
      <img src={src} alt={alt} />
    </button>
  );
}
