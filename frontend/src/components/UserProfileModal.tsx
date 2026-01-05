import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  BookOpen,
  Calendar,
  UserPlus,
  MessageSquare,
  Loader2,
  CheckCircle,
  GraduationCap,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UserSearchResult, createConnection, getConnections } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UserProfileModalProps {
  user: UserSearchResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ user, isOpen, onClose }: UserProfileModalProps) {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Check for existing connections when modal opens
  useEffect(() => {
    if (isOpen && user && currentUser) {
      checkExistingConnection();
    }
  }, [isOpen, user, currentUser]);

  const checkExistingConnection = async () => {
    if (!currentUser || !user) return;

    try {
      const connections = await getConnections(currentUser.uid, currentUser.role);
      const existingConnection = connections.find((conn) => {
        const otherUser = currentUser.role === "teacher" ? conn.student : conn.teacher;
        return otherUser?.uid === user.uid && (conn.status === "pending" || conn.status === "accepted");
      });

      if (existingConnection) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Error checking existing connection:", error);
    }
  };

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleConnect = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to connect",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Determine student and teacher based on roles
      const studentId = currentUser.role === "student" ? currentUser.uid : user.uid;
      const teacherId = currentUser.role === "teacher" ? currentUser.uid : user.uid;

      const result = await createConnection(
        studentId,
        teacherId,
        currentUser.uid,
        message
      );

      if (result.success) {
        setIsConnected(true);
        // Notify other parts of the app a new connection was created so they can refresh
        try {
          window.dispatchEvent(new CustomEvent("connection:created", { detail: { connectionId: result.connectionId } }));
        } catch (e) {
          // ignore in non-browser environments
        }
        toast({
          title: "Request Sent!",
          description: `Your connection request has been sent to ${user.displayName}`,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    // Don't reset isConnected here since we want to persist the state
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-[25%] -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="relative h-24 bg-gradient-to-r from-primary to-purple-600">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 text-white hover:bg-white/20"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Profile Content */}
            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="flex justify-center -mt-12 mb-4">
                <Avatar className="w-24 h-24 border-4 border-card shadow-lg">
                  <AvatarImage src={user.profileImage || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-2xl font-bold">
                    {getInitials(user.displayName || "U")}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Name and Role */}
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  {user.displayName}
                </h2>
                <Badge
                  variant={user.role === "teacher" ? "default" : "secondary"}
                  className="mt-2 capitalize"
                >
                  {user.role === "teacher" ? (
                    <Users className="w-3 h-3 mr-1" />
                  ) : (
                    <GraduationCap className="w-3 h-3 mr-1" />
                  )}
                  {user.role}
                </Badge>
              </div>

              {/* Info Cards */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-foreground">{user.email}</span>
                </div>

                {user.subject && user.subject.length > 0 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                    <BookOpen className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex flex-wrap gap-2">
                      {user.subject.map((subject, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {user.bio && (
                  <div className="p-3 rounded-lg bg-accent/50">
                    <p className="text-sm text-muted-foreground">{user.bio}</p>
                  </div>
                )}

                {user.createdAt && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Connection Message */}
              {!isConnected && (
                <div className="mb-4">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Add a message (optional)
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Introduce yourself to ${user.displayName}...`}
                    className="mt-2 resize-none"
                    rows={3}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isConnected ? (
                  <Button className="flex-1 gap-2" disabled>
                    <CheckCircle className="w-4 h-4" />
                    Request Sent
                  </Button>
                ) : (
                  <Button
                    className="flex-1 gap-2 gradient-bg"
                    onClick={handleConnect}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
