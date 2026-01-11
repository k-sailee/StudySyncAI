import { Button } from "@/components/ui/button";
import ScheduleClassModal from "@/components/dashboard/ScheduleClassModal";
import TeacherScheduledClasses from "@/components/dashboard/TeacherScheduledClasses";
import { useState } from "react";

export default function TeacherDashboardPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Classes</h2>
        <Button onClick={() => setOpen(true)}>
          + Schedule Class
        </Button>
      </div>

      <TeacherScheduledClasses />

      <ScheduleClassModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
