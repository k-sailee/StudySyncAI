import { useSchedule } from "@/context/ScheduleContext";
import ClassCard from "@/components/classes/ClassCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function StudentScheduledClasses() {
  const { classes, loading } = useSchedule();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (!classes.length) return <p>No classes scheduled</p>;

  const previewClasses = classes.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Classes</h2>
        <Button variant="ghost" onClick={() => navigate("/my-classes")}>
          View all →
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {previewClasses.map(cls => (
          <ClassCard key={cls.id} cls={cls} />
        ))}
      </div>
    </div>
  );
}
