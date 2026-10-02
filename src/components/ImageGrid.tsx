type ImageItem = {
  img_src: string;
  url: string;
  title: string;
};

type Props = {
  images: ImageItem[];
};

export default function ImageGrid({ images }: Props) {
  if (images.length === 0) return null;

  return (
    <div className="media-grid">
      {images.map((img, index) => (
        <a
          key={index}
          href={img.url}
          target="_blank"
          rel="noreferrer"
          className="media-card"
        >
          <img src={img.img_src} alt={img.title} />
          <p>{img.title}</p>
        </a>
      ))}
    </div>
  );
}