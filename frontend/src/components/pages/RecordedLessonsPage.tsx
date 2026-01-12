// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Play, Clock, Calendar, Filter, Search, BookOpen, Download, Eye } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// const recordedLessons = [
//   {
//     id: 1,
//     title: "Introduction to Differential Equations",
//     teacher: "Prof. John Smith",
//     teacherAvatar: "/placeholder.svg",
//     subject: "Mathematics",
//     duration: "1h 45m",
//     uploadDate: "May 10, 2024",
//     views: 234,
//     thumbnail: "from-blue-500 to-cyan-500",
//     progress: 75,
//     hasDownload: true,
//   },
//   {
//     id: 2,
//     title: "The Romantic Period in English Literature",
//     teacher: "Dr. Sarah Miller",
//     teacherAvatar: "/placeholder.svg",
//     subject: "English",
//     duration: "1h 20m",
//     uploadDate: "May 8, 2024",
//     views: 189,
//     thumbnail: "from-violet-500 to-purple-600",
//     progress: 100,
//     hasDownload: true,
//   },
//   {
//     id: 3,
//     title: "Quantum Mechanics Basics",
//     teacher: "Dr. Emily Chen",
//     teacherAvatar: "/placeholder.svg",
//     subject: "Physics",
//     duration: "2h 10m",
//     uploadDate: "May 5, 2024",
//     views: 312,
//     thumbnail: "from-orange-500 to-red-500",
//     progress: 30,
//     hasDownload: false,
//   },
//   {
//     id: 4,
//     title: "Object-Oriented Programming Concepts",
//     teacher: "Prof. Alex Johnson",
//     teacherAvatar: "/placeholder.svg",
//     subject: "Computer Science",
//     duration: "1h 55m",
//     uploadDate: "May 3, 2024",
//     views: 456,
//     thumbnail: "from-emerald-500 to-teal-500",
//     progress: 0,
//     hasDownload: true,
//   },
//   {
//     id: 5,
//     title: "Chemical Bonding and Molecular Structure",
//     teacher: "Dr. Michael Brown",
//     teacherAvatar: "/placeholder.svg",
//     subject: "Chemistry",
//     duration: "1h 30m",
//     uploadDate: "May 1, 2024",
//     views: 178,
//     thumbnail: "from-pink-500 to-rose-500",
//     progress: 50,
//     hasDownload: true,
//   },
//   {
//     id: 6,
//     title: "World War II: Causes and Effects",
//     teacher: "Prof. Lisa Anderson",
//     teacherAvatar: "/placeholder.svg",
//     subject: "History",
//     duration: "2h 5m",
//     uploadDate: "Apr 28, 2024",
//     views: 267,
//     thumbnail: "from-amber-500 to-orange-500",
//     progress: 0,
//     hasDownload: false,
//   },
// ];

// export function RecordedLessonsPage() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("all");

//   const filteredLessons = recordedLessons.filter(lesson => {
//     const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                           lesson.teacher.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesSubject = selectedSubject === "all" || lesson.subject === selectedSubject;
//     return matchesSearch && matchesSubject;
//   });

//   const subjects = [...new Set(recordedLessons.map(l => l.subject))];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="font-heading text-2xl lg:text-3xl font-bold">Recorded Lessons</h1>
//         <p className="text-muted-foreground mt-1">Watch and revisit your class recordings anytime</p>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//           <Input
//             placeholder="Search lessons or teachers..."
//             className="pl-10"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <Select value={selectedSubject} onValueChange={setSelectedSubject}>
//           <SelectTrigger className="w-full sm:w-48">
//             <Filter className="w-4 h-4 mr-2" />
//             <SelectValue placeholder="All Subjects" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Subjects</SelectItem>
//             {subjects.map((subject) => (
//               <SelectItem key={subject} value={subject}>{subject}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Continue Watching */}
//       {recordedLessons.some(l => l.progress > 0 && l.progress < 100) && (
//         <div className="space-y-4">
//           <h2 className="font-semibold text-lg flex items-center gap-2">
//             <Play className="w-5 h-5 text-primary" />
//             Continue Watching
//           </h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {recordedLessons.filter(l => l.progress > 0 && l.progress < 100).map((lesson, index) => (
//               <motion.div
//                 key={lesson.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.05 * index }}
//                 className="group bg-card rounded-2xl border border-border shadow-card overflow-hidden hover:shadow-lg transition-all cursor-pointer"
//               >
//                 <div className={cn(
//                   "relative h-36 bg-gradient-to-br flex items-center justify-center",
//                   lesson.thumbnail
//                 )}>
//                   <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
//                   <div className="relative z-10 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
//                     <Play className="w-6 h-6 text-white ml-1" />
//                   </div>
//                   <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
//                     <div 
//                       className="h-full bg-primary transition-all"
//                       style={{ width: `${lesson.progress}%` }}
//                     />
//                   </div>
//                   <Badge className="absolute top-3 right-3 bg-black/50 text-white">
//                     {lesson.progress}% complete
//                   </Badge>
//                 </div>
//                 <div className="p-4">
//                   <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
//                     {lesson.title}
//                   </h3>
//                   <p className="text-sm text-muted-foreground mt-1">{lesson.teacher}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* All Lessons */}
//       <div className="space-y-4">
//         <h2 className="font-semibold text-lg flex items-center gap-2">
//           <BookOpen className="w-5 h-5 text-primary" />
//           All Recordings ({filteredLessons.length})
//         </h2>
        
//         <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
//           {filteredLessons.map((lesson, index) => (
//             <motion.div
//               key={lesson.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.05 * index }}
//               className="group bg-card rounded-2xl border border-border shadow-card overflow-hidden hover:shadow-lg transition-all"
//             >
//               {/* Thumbnail */}
//               <div className={cn(
//                 "relative h-40 bg-gradient-to-br flex items-center justify-center cursor-pointer",
//                 lesson.thumbnail
//               )}>
//                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
//                 <div className="relative z-10 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
//                   <Play className="w-6 h-6 text-white ml-1" />
//                 </div>
//                 <Badge variant="secondary" className="absolute top-3 left-3">
//                   {lesson.subject}
//                 </Badge>
//                 <span className="absolute bottom-3 right-3 text-sm text-white bg-black/50 px-2 py-1 rounded">
//                   {lesson.duration}
//                 </span>
//                 {lesson.progress === 100 && (
//                   <Badge className="absolute top-3 right-3 bg-success text-success-foreground">
//                     Completed
//                   </Badge>
//                 )}
//               </div>

//               {/* Content */}
//               <div className="p-4 space-y-3">
//                 <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
//                   {lesson.title}
//                 </h3>

//                 <div className="flex items-center gap-2">
//                   <Avatar className="w-7 h-7">
//                     <AvatarImage src={lesson.teacherAvatar} />
//                     <AvatarFallback className="text-xs bg-primary/10 text-primary">
//                       {lesson.teacher.split(' ').map(n => n[0]).join('')}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="text-sm text-muted-foreground">{lesson.teacher}</span>
//                 </div>

//                 <div className="flex items-center justify-between text-sm text-muted-foreground">
//                   <div className="flex items-center gap-3">
//                     <span className="flex items-center gap-1">
//                       <Calendar className="w-3 h-3" />
//                       {lesson.uploadDate}
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <Eye className="w-3 h-3" />
//                       {lesson.views}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex gap-2 pt-2">
//                   <Button size="sm" className="flex-1">
//                     <Play className="w-4 h-4 mr-1" />
//                     {lesson.progress > 0 && lesson.progress < 100 ? "Resume" : "Watch"}
//                   </Button>
//                   {lesson.hasDownload && (
//                     <Button size="sm" variant="outline">
//                       <Download className="w-4 h-4" />
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getRecommendedLecturesForStudent } from "@/services/lectureService";
import RecommendedLectureCard from "@/components/lessons/RecommendedLectureCard";

export function RecordedLessonsPage() {
  const { user } = useAuth();
  const [recommended, setRecommended] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    getRecommendedLecturesForStudent(user.uid).then(setRecommended);
  }, [user]);

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Recommended Lessons</h1>
        <p className="text-muted-foreground">
          Watch and revisit your lessons anytime
        </p>
      </div>

      {/* 🔥 RECOMMENDED LECTURES */}
      {recommended.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">
            Recommended by Your Teacher
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((lecture) => (
              <RecommendedLectureCard
                key={lecture.id}
                title={lecture.title}
                youtubeUrl={lecture.youtubeUrl}
              />
            ))}
          </div>
        </section>
      )}

      {/* 🔹 EXISTING RECORDED LESSONS */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          All Recordings
        </h2>

        {/* ⬇️ KEEP YOUR EXISTING RECORDED LESSONS UI HERE ⬇️ */}
      </section>
    </div>
  );
}
