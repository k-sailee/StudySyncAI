import { useSchedule } from "@/context/ScheduleContext";
import ClassCard from "@/components/classes/ClassCard";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function StudentScheduledClasses() {
  const { classes, loading } = useSchedule();
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (loading) return <p>Loading...</p>;
  if (!classes.length) return <p>No classes scheduled</p>;

  const previewClasses = classes.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Classes</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => containerRef.current?.scrollBy({ left: -360, behavior: "smooth" })}
            aria-label="Scroll classes left"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => containerRef.current?.scrollBy({ left: 360, behavior: "smooth" })}
            aria-label="Scroll classes right"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div ref={containerRef} className="flex gap-4 overflow-x-auto hide-scrollbar py-1">
        {previewClasses.map(cls => (
          <div key={cls.id} className="min-w-[300px] flex-shrink-0">
            <ClassCard cls={cls} />
          </div>
        ))}
      </div>
    </div>
  );
}
