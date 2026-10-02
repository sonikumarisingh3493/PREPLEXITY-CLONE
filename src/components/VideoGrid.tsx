type VideoItem = {
  img_src: string;
  url: string;
  title: string;
  iframe_src?: string;
};

type Props = {
  videos: VideoItem[];
};

export default function VideoGrid({ videos }: Props) {
  if (videos.length === 0) return null;

  return (
    <div className="media-grid">
      {videos.map((video, index) => (
        <a
          key={index}
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="media-card"
        >
          {video.img_src && (
            <img
              src={video.img_src}
              alt={video.title}
            />
          )}

          <p>{video.title}</p>
        </a>
      ))}
    </div>
  );
}