import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getConnectedStudents } from "@/services/studentService";
import { useSchedule } from "@/context/ScheduleContext";
import { nanoid } from "nanoid";
interface ScheduleClassModalProps {
  open: boolean;
  onClose: () => void;
}


export default function ScheduleClassModal({
  open,
  onClose,
}: ScheduleClassModalProps) {

const { addClass } = useSchedule();
const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Load students when modal opens
  const loadStudents = async () => {
    const data = await getConnectedStudents();
    setStudents(data);
  };

  const toggleStudent = (uid: string) => {
    setSelectedStudents((prev) =>
      prev.includes(uid)
        ? prev.filter((id) => id !== uid)
        : [...prev, uid]
    );
  };

const handleSubmit = () => {
  if (!user) return;

  const scheduledClass = {
    id: nanoid(),
    subject,
    topics,
    date,
    time,
    students: selectedStudents,
    teacherEmail: user.email!,
    teacherId: user.uid,
  };

  addClass(scheduledClass);

  setSubject("");
  setTopics("");
  setDate("");
  setTime("");
  setSelectedStudents([]);
  onClose();
};



  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={loadStudents}>
        <DialogHeader>
          <DialogTitle>Schedule Class</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Maths"
            />
          </div>

          <div>
            <Label>Topics Covered</Label>
            <Input
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="Linear Equations"
            />
          </div>

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <Label>Time</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div>
            <Label>Select Students</Label>
            <div className="border rounded-md p-2 max-h-40 overflow-y-auto space-y-2">
              {students.map((student) => (
                <div
                  key={student.uid}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={selectedStudents.includes(student.uid)}
                    onCheckedChange={() => toggleStudent(student.uid)}
                  />
                  <span>{student.displayName || student.email}</span>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Schedule Class
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
