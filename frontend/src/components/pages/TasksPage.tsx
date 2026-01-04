import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckSquare, Plus, Calendar, Flag, Clock, Edit2, Trash2, 
  CheckCircle, Circle, Filter, Sparkles, ChevronDown, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/config/firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  getDocs,
  Timestamp 
} from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  userId: string;
  title: string;
  subject: string;
  description: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  progress: number;
  createdAt: Timestamp;
  scheduledTime?: string;
  endTime?: string;
  duration?: number;
  category?: string;
  isScheduled?: boolean;
}

const initialTasks: Task[] = [];

export function TasksPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSchedulerDialogOpen, setIsSchedulerDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [schedulerLoading, setSchedulerLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    deadline: "",
    priority: "medium" as "high" | "medium" | "low",
  });

  // Scheduler form state
  const [schedulerData, setSchedulerData] = useState({
    dailySchedule: [
      { time: "09:00 AM", name: "Morning Meeting", duration: "60" },
    ],
    taskDurations: {} as Record<string, string>,
    taskCategories: {} as Record<string, string>,
  });

  // Scheduler results state
  const [scheduleResult, setScheduleResult] = useState<any>(null);
  const [showScheduleResult, setShowScheduleResult] = useState(false);
  const [showDailySchedule, setShowDailySchedule] = useState(false);

  // Load tasks from Firestore
  useEffect(() => {
    if (!user) {
      console.log("No user found, skipping task load");
      setLoading(false);
      return;
    }

    console.log("Loading tasks for user:", user.uid);

    try {
      const tasksRef = collection(db, "tasks");
      // Start with simpler query without orderBy to avoid composite index requirement
      // Client-side sorting will be done instead
      const q = query(
        tasksRef,
        where("userId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log("Tasks snapshot received:", snapshot.docs.length, "documents");
        const tasksData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a: any, b: any) => {
            // Client-side sort by createdAt descending
            return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
          }) as Task[];
        setTasks(tasksData);
        setLoading(false);
      }, (error: any) => {
        console.error("Error loading tasks - Full error:", {
          code: error.code,
          message: error.message,
          details: error
        });
        
        let errorMessage = "Failed to load tasks. Please try again.";
        if (error.code === "permission-denied") {
          errorMessage = "Permission denied. Check Firestore rules.";
        } else if (error.code === "invalid-argument") {
          errorMessage = "Invalid query. Retrying without index...";
        } else if (error.code === "unavailable") {
          errorMessage = "Firestore is currently unavailable.";
        } else if (error.code === "failed-precondition") {
          errorMessage = "Firestore needs to create an index. This usually takes a few minutes.";
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error: any) {
      console.error("Error setting up task listener:", error);
      toast({
        title: "Error",
        description: "Failed to initialize task loading.",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [user, toast]);

  // Load latest AI schedule from Firestore
  useEffect(() => {
    if (!user) {
      return;
    }

    const loadLatestSchedule = async () => {
      try {
        const schedulesRef = collection(db, "schedules");
        const today = new Date().toISOString().split('T')[0];
        
        console.log("Loading schedule for date:", today);
        
        const q = query(
          schedulesRef,
          where("userId", "==", user.uid),
          where("date", "==", today)
        );

        const snapshot = await getDocs(q);
        
        console.log("Schedule query returned", snapshot.size, "documents");
        
        if (!snapshot.empty) {
          // Get the most recent schedule for today
          const schedules = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          console.log("Schedules loaded:", schedules);
          
          // Sort by createdAt and get the latest
          schedules.sort((a: any, b: any) => {
            return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
          });
          
          const latestSchedule = schedules[0] as any;
          console.log("Latest schedule:", latestSchedule);
          
          setScheduleResult(latestSchedule.scheduleData);
          setShowDailySchedule(true);
          console.log("Loaded latest schedule from Firestore");
        } else {
          console.log("No schedules found for today");
        }
      } catch (error) {
        console.error("Error loading schedule:", error);
        // Fail silently - schedule is optional
      }
    };

    loadLatestSchedule();
  }, [user]);

  // Add new task
  const handleAddTask = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add tasks.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        userId: user.uid,
        title: formData.title,
        subject: formData.subject || "General",
        description: formData.description,
        deadline: formData.deadline || "No deadline",
        priority: formData.priority,
        status: "pending",
        progress: 0,
        createdAt: Timestamp.now(),
      });

      toast({
        title: "Success",
        description: "Task added successfully!",
      });

      // Reset form
      setFormData({
        title: "",
        subject: "",
        description: "",
        deadline: "",
        priority: "medium",
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filter === "all" || task.status === filter;
    const priorityMatch = priorityFilter === "all" || task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const taskRef = doc(db, "tasks", id);
      const newStatus = task.status === "completed" ? "pending" : "completed";
      const newProgress = newStatus === "completed" ? 100 : 0;

      await updateDoc(taskRef, {
        status: newStatus,
        progress: newProgress,
      });

      toast({
        title: "Success",
        description: `Task marked as ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      toast({
        title: "Success",
        description: "Task deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAISchedule = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to use AI Scheduler.",
        variant: "destructive",
      });
      return;
    }

    // Get pending and in-progress tasks
    const pendingTasks = tasks.filter(t => t.status !== "completed");

    if (pendingTasks.length === 0) {
      toast({
        title: "No Tasks",
        description: "You don't have any pending tasks to schedule.",
        variant: "default",
      });
      return;
    }

    setSchedulerLoading(true);

    try {
      // Prepare task list with durations and categories
      const taskList = pendingTasks.map(task => {
        const duration = parseInt(schedulerData.taskDurations[task.id] || "30");
        return {
          id: task.id,
          title: task.title,
          duration: duration,
          priority: task.priority,
          category: schedulerData.taskCategories[task.id] || task.subject || "General",
          description: task.description,
          timePreference: "None",
        };
      });

      // Validate daily schedule
      const validSchedule = schedulerData.dailySchedule.filter(slot => 
        slot.time && slot.name && slot.duration
      );

      if (validSchedule.length === 0) {
        toast({
          title: "Missing Information",
          description: "Please add at least one daily commitment with time, name, and duration.",
          variant: "destructive",
        });
        setSchedulerLoading(false);
        return;
      }

      console.log("Sending schedule request:", {
        dailySchedule: validSchedule,
        taskList,
      });

      const response = await axios.post("/api/scheduler/generate", {
        dailySchedule: validSchedule,
        taskList,
      });

      console.log("Schedule response:", response.data);

      // Store the schedule result for display
      setScheduleResult(response.data);
      setShowScheduleResult(true);
      setShowDailySchedule(true); // Enable viewing schedule on main page

      // Save the complete schedule to Firestore for persistence
      try {
        const scheduleDoc = {
          userId: user.uid,
          scheduleData: response.data,
          createdAt: Timestamp.now(),
          date: new Date().toISOString().split('T')[0], // Store date for filtering
        };
        
        console.log("Saving schedule to Firestore:", scheduleDoc);
        
        const docRef = await addDoc(collection(db, "schedules"), scheduleDoc);
        
        console.log("Schedule saved to Firestore with ID:", docRef.id);
      } catch (saveError) {
        console.error("Error saving schedule to Firestore:", saveError);
        // Continue even if save fails
      }

      // Update tasks with scheduled times in Firestore
      const scheduledTasks = response.data.scheduledTasks || [];
      const updatePromises = scheduledTasks.map(async (scheduled: any) => {
        const task = pendingTasks.find(t => 
          t.id === scheduled.taskId || t.title === scheduled.title || t.title === scheduled.taskId
        );
        
        if (task) {
          const taskRef = doc(db, "tasks", task.id);
          return updateDoc(taskRef, {
            scheduledTime: scheduled.startTime,
            endTime: scheduled.endTime,
            duration: scheduled.duration,
            category: schedulerData.taskCategories[task.id] || task.subject,
            isScheduled: true,
          });
        }
      });

      await Promise.all(updatePromises.filter(Boolean));

      toast({
        title: "Success!",
        description: `AI scheduled ${scheduledTasks.length} out of ${pendingTasks.length} tasks!`,
      });

      // Don't close dialog, show results instead
    } catch (error: any) {
      console.error("Error scheduling tasks:", error);
      console.error("Error response:", error.response);
      
      let errorMessage = "Failed to generate schedule. Please try again.";
      
      if (error.response?.data) {
        errorMessage = error.response.data.error || errorMessage;
        if (error.response.data.details) {
          errorMessage += ` Details: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSchedulerLoading(false);
    }
  };

  const addScheduleSlot = () => {
    setSchedulerData({
      ...schedulerData,
      dailySchedule: [
        ...schedulerData.dailySchedule,
        { time: "", name: "", duration: "" },
      ],
    });
  };

  const updateScheduleSlot = (index: number, field: string, value: string) => {
    const newSchedule = [...schedulerData.dailySchedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedulerData({ ...schedulerData, dailySchedule: newSchedule });
  };

  const removeScheduleSlot = (index: number) => {
    const newSchedule = schedulerData.dailySchedule.filter((_, i) => i !== index);
    setSchedulerData({ ...schedulerData, dailySchedule: newSchedule });
  };

  const reloadScheduleFromFirestore = async () => {
    if (!user) return;

    try {
      console.log("Manually reloading schedule from Firestore...");
      const schedulesRef = collection(db, "schedules");
      const today = new Date().toISOString().split('T')[0];
      
      const q = query(
        schedulesRef,
        where("userId", "==", user.uid),
        where("date", "==", today)
      );

      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const schedules = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        schedules.sort((a: any, b: any) => {
          return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
        });
        
        const latestSchedule = schedules[0] as any;
        setScheduleResult(latestSchedule.scheduleData);
        setShowDailySchedule(true);
        
        toast({
          title: "Success",
          description: "Schedule loaded from database!",
        });
      } else {
        toast({
          title: "No Schedule",
          description: "No schedule found for today. Generate one first!",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error reloading schedule:", error);
      toast({
        title: "Error",
        description: "Failed to reload schedule.",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-muted text-muted-foreground border-border";
      default: return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/10 text-success";
      case "in-progress": return "bg-primary/10 text-primary";
      case "pending": return "bg-muted text-muted-foreground";
      default: return "";
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    pending: tasks.filter(t => t.status === "pending").length,
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        </div>
      ) : (
        <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and track your assignments</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={reloadScheduleFromFirestore}
          >
            <RefreshCw className="w-4 h-4" />
            Load Schedule
          </Button>
          {showDailySchedule && scheduleResult && (
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setShowDailySchedule(!showDailySchedule)}
            >
              <Calendar className="w-4 h-4" />
              View Daily Schedule
            </Button>
          )}
          <Dialog open={isSchedulerDialogOpen} onOpenChange={(open) => {
            setIsSchedulerDialogOpen(open);
            if (!open) {
              setShowScheduleResult(false);
              // Don't reset scheduleResult - keep it for display on main page
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Sparkles className="w-4 h-4" />
                AI Scheduler
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {showScheduleResult ? "Your Optimized Schedule" : "AI Task Scheduler"}
                </DialogTitle>
              </DialogHeader>
              
              {!showScheduleResult ? (
                // Input Form
                <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Your Daily Commitments</Label>
                  <p className="text-sm text-muted-foreground">
                    Add your existing calendar events so AI can find free slots. Use 12-hour format with AM/PM (e.g., 09:00 AM, 02:30 PM)
                  </p>
                  
                  <div className="space-y-2 mt-3">
                    {schedulerData.dailySchedule.map((slot, index) => (
                      <div key={index} className="flex gap-2 items-start p-3 border rounded-lg">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <div>
                            <Input 
                              type="text"
                              placeholder="09:00 AM"
                              value={slot.time}
                              onChange={(e) => updateScheduleSlot(index, "time", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground mt-1">HH:MM AM/PM</p>
                          </div>
                          <div>
                            <Input 
                              placeholder="Event name"
                              value={slot.name}
                              onChange={(e) => updateScheduleSlot(index, "name", e.target.value)}
                            />
                          </div>
                          <div>
                            <Input 
                              type="number"
                              placeholder="Duration (min)"
                              value={slot.duration}
                              onChange={(e) => updateScheduleSlot(index, "duration", e.target.value)}
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() => removeScheduleSlot(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={addScheduleSlot}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Time Slot
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">Tasks to Schedule</Label>
                  <p className="text-sm text-muted-foreground">
                    Set duration and category for each task
                  </p>
                  
                  <div className="space-y-2 mt-3 max-h-64 overflow-y-auto">
                    {tasks.filter(t => t.status !== "completed").map((task) => (
                      <div key={task.id} className="p-3 border rounded-lg space-y-2">
                        <div className="font-medium">{task.title}</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Duration (minutes)</Label>
                            <Input 
                              type="number"
                              placeholder="30"
                              value={schedulerData.taskDurations[task.id] || ""}
                              onChange={(e) => setSchedulerData({
                                ...schedulerData,
                                taskDurations: {
                                  ...schedulerData.taskDurations,
                                  [task.id]: e.target.value
                                }
                              })}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Category</Label>
                            <Select
                              value={schedulerData.taskCategories[task.id] || task.subject}
                              onValueChange={(value) => setSchedulerData({
                                ...schedulerData,
                                taskCategories: {
                                  ...schedulerData.taskCategories,
                                  [task.id]: value
                                }
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Work">Work</SelectItem>
                                <SelectItem value="Study">Study</SelectItem>
                                <SelectItem value="Personal">Personal</SelectItem>
                                <SelectItem value="Health">Health</SelectItem>
                                <SelectItem value="Exercise">Exercise</SelectItem>
                                <SelectItem value="Reading">Reading</SelectItem>
                                <SelectItem value="Project">Project</SelectItem>
                                <SelectItem value="General">General</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <span>Deadline: {task.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full gradient-bg" 
                  onClick={handleAISchedule}
                  disabled={schedulerLoading}
                >
                  {schedulerLoading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Generating Schedule...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate AI Schedule
                    </>
                  )}
                </Button>
              </div>
              ) : (
                // Results Display
                <div className="space-y-6 py-4">
                  {/* Summary Section */}
                  {scheduleResult?.summary && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-3">Schedule Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="text-center p-2 bg-card rounded">
                          <div className="text-2xl font-bold text-primary">{scheduleResult.summary.totalTasksScheduled}</div>
                          <div className="text-xs text-muted-foreground">Tasks Scheduled</div>
                        </div>
                        <div className="text-center p-2 bg-card rounded">
                          <div className="text-2xl font-bold">{scheduleResult.summary.totalTasks}</div>
                          <div className="text-xs text-muted-foreground">Total Tasks</div>
                        </div>
                        <div className="text-center p-2 bg-card rounded">
                          <div className="text-lg font-semibold">{scheduleResult.summary.totalTaskTime}</div>
                          <div className="text-xs text-muted-foreground">Task Time</div>
                        </div>
                        <div className="text-center p-2 bg-card rounded">
                          <div className="text-lg font-semibold">{scheduleResult.summary.freeTimeRemaining}</div>
                          <div className="text-xs text-muted-foreground">Free Time</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm font-medium">Schedule Density:</span>
                        <Badge variant={
                          scheduleResult.summary.scheduleDensity === "Heavy" ? "destructive" :
                          scheduleResult.summary.scheduleDensity === "Moderate" ? "default" : "secondary"
                        }>
                          {scheduleResult.summary.scheduleDensity}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Optimized Schedule Table */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Your Optimized Daily Schedule
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Task</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Duration</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Priority</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scheduleResult?.scheduledTasks?.map((task: any, index: number) => (
                            <tr key={index} className="border-t hover:bg-accent/50">
                              <td className="px-4 py-3 text-sm font-mono">
                                {task.startTime} - {task.endTime}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium">{task.title}</td>
                              <td className="px-4 py-3 text-sm">{task.duration} min</td>
                              <td className="px-4 py-3">
                                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <Badge variant="secondary">{task.category}</Badge>
                              </td>
                            </tr>
                          ))}
                          {scheduleResult?.breaks?.map((brk: any, index: number) => (
                            <tr key={`break-${index}`} className="border-t bg-success/5">
                              <td className="px-4 py-3 text-sm font-mono">
                                {brk.startTime} - {brk.endTime}
                              </td>
                              <td className="px-4 py-3 text-sm italic text-muted-foreground">Break</td>
                              <td className="px-4 py-3 text-sm">{brk.duration} min</td>
                              <td className="px-4 py-3">-</td>
                              <td className="px-4 py-3">-</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Optimization Notes */}
                  {scheduleResult?.optimizationNotes && scheduleResult.optimizationNotes.length > 0 && (
                    <div className="bg-accent/30 rounded-lg p-4">
                      <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Optimization Notes
                      </h3>
                      <ul className="space-y-1">
                        {scheduleResult.optimizationNotes.map((note: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggestions */}
                  {scheduleResult?.suggestions && scheduleResult.suggestions.length > 0 && (
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                      <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Suggestions
                      </h3>
                      <ul className="space-y-1">
                        {scheduleResult.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-warning mt-1">💡</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Unscheduled Tasks */}
                  {scheduleResult?.unscheduledTasks && scheduleResult.unscheduledTasks.length > 0 && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <h3 className="font-semibold text-sm mb-2 flex items-center gap-2 text-destructive">
                        <Flag className="w-4 h-4" />
                        Unscheduled Tasks ({scheduleResult.unscheduledTasks.length})
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        These tasks couldn't fit in today's schedule. Consider moving them to another day or reducing their duration.
                      </p>
                      <div className="space-y-2">
                        {scheduleResult.unscheduledTasks.map((task: any, index: number) => (
                          <div key={index} className="bg-card p-3 rounded border">
                            <div className="font-medium text-sm">{task.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">{task.reason}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setShowScheduleResult(false);
                        setScheduleResult(null);
                      }}
                    >
                      Back to Scheduler
                    </Button>
                    <Button 
                      className="flex-1 gradient-bg"
                      onClick={() => {
                        setIsSchedulerDialogOpen(false);
                        setShowScheduleResult(false);
                        setScheduleResult(null);
                      }}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-bg">
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Task Title</Label>
                  <Input 
                    placeholder="Enter task title..." 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select 
                    value={formData.subject} 
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Task description..." 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value: "high" | "medium" | "low") => 
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Deadline</Label>
                    <Input 
                      type="date" 
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                </div>
                <Button 
                  className="w-full gradient-bg" 
                  onClick={handleAddTask}
                >
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", value: stats.total, icon: CheckSquare, color: "text-foreground" },
          { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-success" },
          { label: "In Progress", value: stats.inProgress, icon: Clock, color: "text-primary" },
          { label: "Pending", value: stats.pending, icon: Circle, color: "text-muted-foreground" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className="bg-card rounded-xl border border-border p-4 shadow-card"
          >
            <div className="flex items-center justify-between">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
              <span className={cn("text-2xl font-bold", stat.color)}>{stat.value}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <Flag className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {scheduleResult && (
          <div className="flex gap-2">
            <Button
              variant={showDailySchedule ? "default" : "outline"}
              className={showDailySchedule ? "gap-2 gradient-bg" : "gap-2"}
              onClick={() => setShowDailySchedule(!showDailySchedule)}
            >
              <Sparkles className="w-4 h-4" />
              {showDailySchedule ? "Hide" : "View"} AI Scheduled Timetable
            </Button>
            {showDailySchedule && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setScheduleResult(null);
                  setShowDailySchedule(false);
                  toast({
                    title: "Schedule Cleared",
                    description: "The AI schedule has been cleared from view.",
                  });
                }}
              >
                Clear Schedule
              </Button>
            )}
          </div>
        )}
      </div>

      {/* AI Generated Daily Schedule */}
      {showDailySchedule && scheduleResult && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl border-2 border-primary/30 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
               AI Optimized Schedule Timetable
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your personalized time-blocked schedule generated by AI
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDailySchedule(false)}
            >
              <ChevronDown className="w-4 h-4 mr-1" />
              Hide
            </Button>
          </div>

          {/* Summary Cards */}
          {scheduleResult.summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-xl p-4 text-center shadow-md border"
              >
                <div className="text-3xl font-bold text-primary mb-1">{scheduleResult.summary.totalTasksScheduled}</div>
                <div className="text-xs text-muted-foreground font-medium">Tasks Scheduled</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-xl p-4 text-center shadow-md border"
              >
                <div className="text-xl font-bold mb-1">{scheduleResult.summary.totalTaskTime}</div>
                <div className="text-xs text-muted-foreground font-medium">Total Task Time</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-xl p-4 text-center shadow-md border"
              >
                <div className="text-xl font-bold mb-1">{scheduleResult.summary.freeTimeRemaining}</div>
                <div className="text-xs text-muted-foreground font-medium">Free Time Left</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card rounded-xl p-4 text-center shadow-md border"
              >
                <Badge 
                  variant={
                    scheduleResult.summary.scheduleDensity === "Heavy" ? "destructive" :
                    scheduleResult.summary.scheduleDensity === "Moderate" ? "default" : "secondary"
                  }
                  className="text-sm px-3 py-1"
                >
                  {scheduleResult.summary.scheduleDensity}
                </Badge>
                <div className="text-xs text-muted-foreground font-medium mt-2">Schedule Density</div>
              </motion.div>
            </div>
          )}

          {/* Time-Blocked Schedule Table */}
          <div className="bg-card rounded-xl border shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
              <h3 className="font-semibold text-lg text-primary-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Time-Blocked Daily Schedule
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Time (AM/PM)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Task Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Priority</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">AI Reasoning</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {scheduleResult.scheduledTasks?.map((task: any, index: number) => (
                    <motion.tr 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-accent/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <div className="font-mono text-sm font-semibold">
                            {task.startTime}
                            <br />
                            <span className="text-muted-foreground text-xs">to {task.endTime}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-base">{task.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="font-mono">
                          {task.duration} min
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant="outline" 
                          className={cn("font-medium", getPriorityColor(task.priority))}
                        >
                          <Flag className="w-3 h-3 mr-1" />
                          {task.priority.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="font-medium">
                          {task.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground max-w-xs">
                          {task.reason || "Optimally scheduled based on priority and available time"}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  
                  {/* Break Rows */}
                  {scheduleResult.breaks?.map((brk: any, index: number) => (
                    <motion.tr 
                      key={`break-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (scheduleResult.scheduledTasks?.length + index) * 0.05 }}
                      className="bg-success/5 hover:bg-success/10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-success" />
                          <div className="font-mono text-sm font-semibold text-success">
                            {brk.startTime}
                            <br />
                            <span className="text-xs">to {brk.endTime}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium italic text-success">☕ Break Time</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="font-mono bg-success/10">
                          {brk.duration} min
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground">-</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="bg-success/10">Rest</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground italic">
                          {brk.reason || "Scheduled break for productivity"}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Optimization Notes */}
            {scheduleResult.optimizationNotes && scheduleResult.optimizationNotes.length > 0 && (
              <div className="bg-accent/20 border border-accent rounded-xl p-5">
                <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  AI Optimization Notes
                </h4>
                <ul className="space-y-2">
                  {scheduleResult.optimizationNotes.map((note: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-primary text-lg leading-none">✓</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {scheduleResult.suggestions && scheduleResult.suggestions.length > 0 && (
              <div className="bg-warning/10 border border-warning/30 rounded-xl p-5">
                <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-warning" />
                  Smart Suggestions
                </h4>
                <ul className="space-y-2">
                  {scheduleResult.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-warning text-lg leading-none">💡</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Unscheduled Tasks Warning */}
          {scheduleResult.unscheduledTasks && scheduleResult.unscheduledTasks.length > 0 && (
            <div className="mt-4 bg-destructive/10 border-2 border-destructive/30 rounded-xl p-5">
              <h4 className="font-semibold text-base mb-3 flex items-center gap-2 text-destructive">
                <Flag className="w-5 h-5" />
                ⚠ Unscheduled Tasks ({scheduleResult.unscheduledTasks.length})
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                These tasks couldn't fit in today's schedule. Consider moving them to another day, reducing duration, or adjusting priorities.
              </p>
              <div className="grid gap-2">
                {scheduleResult.unscheduledTasks.map((task: any, index: number) => (
                  <div key={index} className="bg-card border border-destructive/20 p-3 rounded-lg">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <span className="font-semibold">Reason:</span> {task.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: 0.03 * index }}
              className={cn(
                "group bg-card rounded-xl border shadow-card p-4 transition-all",
                task.status === "completed" ? "opacity-60" : "",
                getPriorityColor(task.priority)
              )}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-1 shrink-0"
                >
                  {task.status === "completed" ? (
                    <CheckCircle className="w-6 h-6 text-success" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className={cn(
                      "font-semibold",
                      task.status === "completed" && "line-through"
                    )}>
                      {task.title}
                    </h3>
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      {task.status.replace("-", " ")}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <Badge variant="secondary">{task.subject}</Badge>
                    {task.isScheduled && task.scheduledTime && (
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.scheduledTime} - {task.endTime}
                      </Badge>
                    )}
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {task.deadline}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Flag className={cn(
                        "w-4 h-4",
                        task.priority === "high" && "text-destructive",
                        task.priority === "medium" && "text-warning"
                      )} />
                      {task.priority}
                    </span>
                    {task.duration && (
                      <span className="text-muted-foreground">
                        {task.duration} min
                      </span>
                    )}
                  </div>

                  {task.progress > 0 && task.progress < 100 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{task.progress}%</span>
                      </div>
                      <div className="h-2 bg-accent rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 text-destructive hover:text-destructive"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CheckSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-semibold text-lg">No tasks found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or add a new task</p>
          </motion.div>
        )}
      </div>
      </>
      )}
    </div>
  );
}
