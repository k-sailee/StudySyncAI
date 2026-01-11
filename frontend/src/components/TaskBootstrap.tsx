import { useLoadTasks } from "@/hooks/useLoadTasks";

export default function TaskBootstrap() {
  useLoadTasks(); // ✅ now inside providers
  return null;
}
