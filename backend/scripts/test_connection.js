(async () => {
  try {
    const base = "http://localhost:5000/api";
    const studentId = "test-student-1";
    const teacherId = "test-teacher-1";

    console.log("Creating connection...");
    const createRes = await fetch(`${base}/connections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, teacherId, requestedBy: studentId, message: "Hello teacher" }),
    });
    const createData = await createRes.json();
    console.log("Create response:", createData);

    console.log("Fetching connections for student...");
    const studentRes = await fetch(`${base}/connections?userId=${encodeURIComponent(studentId)}&role=student`);
    const studentData = await studentRes.json();
    console.log("Student connections:", JSON.stringify(studentData, null, 2));

    console.log("Fetching connections for teacher...");
    const teacherRes = await fetch(`${base}/connections?userId=${encodeURIComponent(teacherId)}&role=teacher`);
    const teacherData = await teacherRes.json();
    console.log("Teacher connections:", JSON.stringify(teacherData, null, 2));
  } catch (err) {
    console.error('Test script error:', err);
  }
})();
