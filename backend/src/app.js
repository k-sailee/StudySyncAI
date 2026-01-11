import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";
import usersRoutes from "./routes/users.routes.js";
import connectionsRoutes from "./routes/connections.routes.js";
import schedulerRoutes from "./routes/scheduler.routes.js";
import taskRoutes from "./routes/taskRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import supportRoutes from "./routes/support.routes.js";
import studyGroupsRoutes from "./routes/studyGroups.routes.js";
import groupsRoutes from "./routes/groups.routes.js";
import liveSessionsRoutes from "./routes/liveSessions.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/ai", aiRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/connections", connectionsRoutes);
app.use("/api/scheduler", schedulerRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/studygroups", studyGroupsRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/live-sessions", liveSessionsRoutes);
// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
