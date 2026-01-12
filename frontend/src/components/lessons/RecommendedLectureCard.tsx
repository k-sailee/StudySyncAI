interface Props {
  title: string;
  youtubeUrl: string;
  teacherName?: string;
}

const getYoutubeThumbnail = (url: string) => {
  const id =
    url.includes("watch?v=")
      ? url.split("v=")[1]?.split("&")[0]
      : url.split("/").pop();

  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

export default function RecommendedLectureCard({
  title,
  youtubeUrl,
  teacherName = "Your Teacher",
}: Props) {
  return (
    <a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer">
        <div className="relative">
          <img
            src={getYoutubeThumbnail(youtubeUrl)}
            alt={title}
            className="w-full h-40 object-cover rounded-t-xl"
          />

          {/* ▶ PLAY ICON */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 rounded-full p-4 text-white text-xl">
              ▶
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Recommended by {teacherName}
          </p>
        </div>
      </div>
    </a>
  );
}
