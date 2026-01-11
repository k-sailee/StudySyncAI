import { Calendar, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ClassCard({ cls }: { cls: any }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/classes/${cls.id}`)}
      className="cursor-pointer
    rounded-3xl
    bg-white/90
    backdrop-blur-md
    p-6

    shadow-[0_15px_40px_rgba(128,90,213,0.20)]
    hover:shadow-[0_25px_60px_rgba(128,90,213,0.35)]
    hover:-translate-y-1

    transition-all
    duration-300
  "
    >
      {/* Subject */}
      <h3 className="text-lg font-semibold capitalize">
        {cls.subject}
      </h3>

      {/* Topics */}
      <p className="text-sm text-muted-foreground">
        Topics: {cls.topics}
      </p>

      {/* Meta */}
      <div className="mt-3 space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{cls.date}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span>{cls.time}</span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span>{cls.students?.length || 0} students</span>
        </div>
      </div>
    </div>
  );
}
