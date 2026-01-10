import { useState } from "react";
import CreateAssignmentModal from "@/components/assignments/CreateAssignmentModal";
import AssignmentsPage from "./AssignmentsPage";
import { Button } from "@/components/ui/button";
import ScheduleClassModal from "@/components/dashboard/ScheduleClassModal";
import TeacherScheduledClasses from "@/components/dashboard/TeacherScheduledClasses";


const TeacherDashboardPage = () => {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  return (
   <div className="space-y-6">
      <Button onClick={() => setOpen(true)}>
        + Schedule Class
      </Button>

      <ScheduleClassModal
        open={open}
        onClose={() => setOpen(false)}
      />

  
       <TeacherScheduledClasses />
  
    </div>
  );
};

export default TeacherDashboardPage;
