import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Lock, Globe, Trash2 } from "lucide-react";

interface Props {
  group: any;
  onJoin: (id: string) => void;
  onDelete?: (id: string) => void;
  onOpen?: (id: string) => void;
  onLeave?: (id: string) => void;
  joining?: boolean;
  isMember?: boolean;
  requestSent?: boolean;
  isAdmin?: boolean;
}

const subjectColor = (subject: string) => {
  // simple mapping to gradient classes similar to ClassesSection
  if (!subject) return "from-violet-500 to-purple-600";
  const s = subject.toLowerCase();
  if (s.includes("math")) return "from-blue-500 to-cyan-500";
  if (s.includes("physics")) return "from-orange-500 to-red-500";
  if (s.includes("computer")) return "from-emerald-500 to-teal-500";
  return "from-violet-500 to-purple-600";
};

export default function StudyGroupCard({ group, onJoin, onDelete, onOpen, onLeave, joining, isMember, requestSent, isAdmin }: Props) {
  const grad = subjectColor(group.subject || "");
  const navigate = useNavigate();
  return (
    <div onClick={() => onOpen?.(group.id)} className="group relative bg-card rounded-2xl border border-border shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className={`h-20 bg-gradient-to-br ${grad} p-4 relative`}> 
        <div className="relative z-10">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-foreground truncate">{group.name}</h3>
          {isAdmin && <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Admin</div>}
        </div>
        <p className="text-sm text-muted-foreground">{group.subject}</p>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1"><Users className="w-4 h-4" /> <span>{group.memberCount ?? "-"} members</span></div>
            <div className="flex items-center gap-1">
              {group.visibility === "public" ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span className="text-xs">{group.visibility === "public" ? "Public" : "Private"}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); onDelete?.(group.id); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}

              {isMember ? (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onOpen?.(group.id); }}>Open</Button>
                  {!isAdmin && (
                    <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); onLeave?.(group.id); }}>Leave</Button>
                  )}
                </div>
              ) : (
                <Button size="sm" onClick={(e) => { e.stopPropagation(); onJoin(group.id); }} disabled={joining}>{joining ? "Joining..." : "Join"}</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
