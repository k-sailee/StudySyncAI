import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/getInitials";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Avatar */}
      <Avatar
        onClick={() => setOpen((p) => !p)}
        className="w-9 h-9 cursor-pointer border-2 border-primary/30 hover:scale-105 transition"
      >
        <AvatarImage src={user?.photoURL || ""} />
        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
          {getInitials(user?.displayName)}
        </AvatarFallback>
      </Avatar>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 12, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 rounded-xl border bg-card shadow-xl z-50"
          >
            <div className="px-4 py-3 border-b">
              <p className="font-medium text-sm truncate">
                {user?.displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>

            <div className="p-2 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
              >
                <User className="w-4 h-4" />
                View Profile
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-destructive"
                onClick={logout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
