import { motion } from "framer-motion";
import { BookOpen, Users, Clock, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";

const classes = [
  {
    id: 1,
    name: "English Literature",
    unit: "UNIT II - Shakespeare",
    color: "from-violet-500 to-purple-600",
    students: 32,
    instructor: "Dr. Sarah Miller",
    lastActivity: "2 hours ago",
    progress: 65,
  },
  {
    id: 2,
    name: "Mathematics",
    unit: "UNIT III - Calculus",
    color: "from-blue-500 to-cyan-500",
    students: 28,
    instructor: "Prof. John Smith",
    lastActivity: "1 hour ago",
    progress: 45,
  },
  {
    id: 3,
    name: "Physics",
    unit: "UNIT I - Mechanics",
    color: "from-orange-500 to-red-500",
    students: 25,
    instructor: "Dr. Emily Chen",
    lastActivity: "3 hours ago",
    progress: 80,
  },
  {
    id: 4,
    name: "Computer Science",
    unit: "UNIT IV - Algorithms",
    color: "from-emerald-500 to-teal-500",
    students: 30,
    instructor: "Prof. Alex Johnson",
    lastActivity: "30 mins ago",
    progress: 55,
  },
];

export function ClassesSection() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);

  const openClass = (c: any) => {
    setSelectedClass(c);
    setSheetOpen(true);
  };

  const closeClass = () => {
    setSheetOpen(false);
    setSelectedClass(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold">Classes</h2>
        <Button variant="ghost" className="text-primary hover:text-primary/80">
          View all
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {classes.map((classItem, index) => (
          <motion.div
            key={classItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className="group relative bg-card rounded-2xl border border-border shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => openClass(classItem)}
          >
            {/* Header with gradient */}
            <div className={`h-24 bg-gradient-to-br ${classItem.color} p-4 relative`}>
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
              </div>
              {/* Progress indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                <div 
                  className="h-full bg-white/80 transition-all duration-500"
                  style={{ width: `${classItem.progress}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {classItem.name}
                </h3>
                <p className="text-sm text-muted-foreground">{classItem.unit}</p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{classItem.students} students</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {classItem.instructor.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground truncate max-w-20">
                    {classItem.instructor}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{classItem.lastActivity}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sheet / Drawer for class details */}
      <Sheet open={sheetOpen} onOpenChange={(o) => { if (!o) closeClass(); setSheetOpen(o); }}>
        <SheetContent side="right">
          <div className="flex items-start justify-between p-4">
            <div>
              <h3 className="text-lg font-semibold">{selectedClass?.name}</h3>
              <div className="text-sm text-muted-foreground">{selectedClass?.unit}</div>
            </div>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" aria-label="Close">
                <X className="w-4 h-4" />
              </Button>
            </SheetClose>
          </div>

          <div className="px-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{selectedClass?.lastActivity}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{selectedClass?.students} students</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">{selectedClass?.instructor?.split(' ').map((n:any)=>n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{selectedClass?.instructor}</div>
                <div className="text-xs text-muted-foreground">Instructor</div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
