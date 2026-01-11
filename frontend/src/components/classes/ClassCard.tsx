import { Calendar, Clock, Users, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ClassCard({ cls }: { cls: any }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/classes/${cls.id}`)}
      className="cursor-pointer rounded-xl bg-card backdrop-blur-md overflow-hidden p-0 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
    >
      {/* Top gradient header with icon */}
      <div className={`h-16 bg-gradient-to-br from-violet-500 to-indigo-500 p-3 flex items-start`}> 
        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
          <Book className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="p-5">
        {/* Subject / Class name */}
        <h3 className="text-lg lg:text-xl font-semibold text-foreground leading-tight">{cls.subject}</h3>

        {/* Topics / subtitle */}
        <p className="text-sm text-muted-foreground mt-1 truncate">{cls.topics}</p>

        {/* Meta row: date, time, students */}
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{cls.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{cls.time}</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Users className="w-4 h-4 text-primary" />
            <span>{cls.students?.length || 0} students</span>
          </div>
        </div>
      </div>
    </div>
  );
}
