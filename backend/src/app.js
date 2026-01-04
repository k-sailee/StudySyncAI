import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";
import usersRoutes from "./routes/users.routes.js";
import connectionsRoutes from "./routes/connections.routes.js";
import schedulerRoutes from "./routes/scheduler.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/ai", aiRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/connections", connectionsRoutes);
app.use("/api/scheduler", schedulerRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
