import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee, Wind, Gamepad2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { completeFocusSession } from "@/services/progressService";
import PeaceMode from "./PeaceMode";

type TimerMode = "focus" | "break";

export function FocusTimer() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<TimerMode>("focus");
  const [showPeaceMode, setShowPeaceMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const focusTime = 25 * 60;
  const breakTime = 5 * 60;
useEffect(() => {
  if (isRunning && timeLeft > 0) {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
  }

  // 🔥 THIS IS THE IMPORTANT PART
  if (timeLeft === 0 && isRunning) {
    setIsRunning(false);

    if (mode === "focus") {
      // ⬇️ LOG FOCUS SESSION HERE
      handleFocusComplete(focusTime / 60); // 25 minutes

      setMode("break");
      setTimeLeft(breakTime);
    } else {
      setMode("focus");
      setTimeLeft(focusTime);
    }
  }

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [isRunning, timeLeft, mode]);

  // useEffect(() => {
  //   if (isRunning && timeLeft > 0) {
  //     intervalRef.current = setInterval(() => {
  //       setTimeLeft((prev) => prev - 1);
  //     }, 1000);
  //   } else if (timeLeft === 0) {
  //     // Timer completed
  //     if (mode === "focus") {
  //       setMode("break");
  //       setTimeLeft(breakTime);
  //     } else {
  //       setMode("focus");
  //       setTimeLeft(focusTime);
  //     }
  //     setIsRunning(false);
  //   }

  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //     }
  //   };
  // }, [isRunning, timeLeft, mode]);
const handleFocusComplete = async (minutes: number) => {
  try {
    await completeFocusSession(minutes);
    console.log("Focus session logged:", minutes);
  } catch (err) {
    console.error("Failed to log focus session", err);
  }
};
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? focusTime : breakTime);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === "focus" ? focusTime : breakTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = mode === "focus" 
    ? ((focusTime - timeLeft) / focusTime) * 100
    : ((breakTime - timeLeft) / breakTime) * 100;

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      id="focus-timer"
      className="bg-card rounded-2xl border border-border shadow-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-semibold">Focus Timer</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-8 p-1 bg-accent/50 rounded-xl">
        <button
          onClick={() => switchMode("focus")}
          className={cn(
            "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
            mode === "focus"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Focus
        </button>
        <button
          onClick={() => switchMode("break")}
          className={cn(
            "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
            mode === "break"
              ? "bg-secondary text-secondary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Break
        </button>
      </div>

      {/* Timer Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative w-52 h-52">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="104"
              cy="104"
              r="90"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-accent"
            />
            <motion.circle
              cx="104"
              cy="104"
              r="90"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={mode === "focus" ? "text-primary" : "text-secondary"}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
              }}
              initial={false}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={timeLeft}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="text-4xl font-bold font-heading"
              >
                {formatTime(timeLeft)}
              </motion.span>
            </AnimatePresence>
            <span className="text-sm text-muted-foreground mt-1">
              {mode === "focus" ? "Stay focused!" : "Take a break"}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
          onClick={resetTimer}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          className={cn(
            "w-16 h-16 rounded-full shadow-lg transition-all",
            mode === "focus" ? "gradient-bg hover:opacity-90" : "gradient-secondary-bg hover:opacity-90"
          )}
          onClick={toggleTimer}
        >
          {isRunning ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-1" />
          )}
        </Button>
        <div className="w-12 h-12" /> {/* Spacer for symmetry */}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Quick Wellness Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors group">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Coffee className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-xs font-medium">Mind Map</span>
          </button>
          <button 
            onClick={() => setShowPeaceMode(true)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors group">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wind className="w-5 h-5 text-success" />
            </div>
            <span className="text-xs font-medium">Peace Mode</span>
          </button>
          <button 
            onClick={() => navigate('/zombie-game')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors group">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-medium">Mini Game</span>
          </button>
        </div>
      </div>
    </motion.div>

      <AnimatePresence>
        {showPeaceMode && <PeaceMode onClose={() => setShowPeaceMode(false)} />}
      </AnimatePresence>
    </>
  );
}
