import { useEffect, useState } from "react";
import { getConnectedStudents } from "@/services/studentService";
import { addRecommendedLecture } from "@/services/lectureService";
import { Label } from "@/components/ui/label";
import { auth } from "@/config/firebase";

const RecommendLecture = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useEffect(() => {
    getConnectedStudents().then(setStudents);
  }, []);

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const handleRecommend = async () => {
    if (!title || !youtubeUrl || selectedStudents.length === 0) {
      alert("Fill all fields and select students");
      return;
    }

    const teacherId = auth.currentUser?.uid;
    if (!teacherId) return;

    await addRecommendedLecture({
      title,
      youtubeUrl,
      teacherId,
      studentIds: selectedStudents,
    });

    setTitle("");
    setYoutubeUrl("");
    setSelectedStudents([]);
    alert("Lecture recommended successfully");
  };

  return (
    <div className="max-w-xl bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Recommend Lecture</h2>

      <div className="space-y-2">
        <Label>Title</Label>
        <input
          className="input"
          placeholder="Web Development"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2 mt-3">
        <Label>YouTube Link</Label>
        <input
          className="input"
          placeholder="https://youtube.com/..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
      </div>

      {/* ✅ SAME AS ASSIGNMENT */}
      <div className="mt-4">
        <Label>Select Students</Label>
        <div className="max-h-40 overflow-y-auto border rounded-lg p-2 mt-1">
          {students.map((s) => (
            <label
              key={s.uid}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedStudents.includes(s.uid)}
                onChange={() => toggleStudent(s.uid)}
              />
              {s.displayName || s.email}
            </label>
          ))}
        </div>
      </div>

      <button
        className="btn-primary mt-4"
        onClick={handleRecommend}
        disabled={selectedStudents.length === 0}
      >
        Recommend
      </button>
    </div>
  );
};

export default RecommendLecture;
