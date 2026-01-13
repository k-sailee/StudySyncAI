import { Badge } from "@/components/ui/badge";

export function TaskTypeBadge({ isAssignment }: { isAssignment: boolean }) {
  return isAssignment ? (
    <Badge className="bg-purple-100 text-purple-700 border border-purple-200">
      📘 Assignment
    </Badge>
  ) : (
    <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
      📝 Task
    </Badge>
  );
}
