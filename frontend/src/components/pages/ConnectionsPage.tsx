import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  UserCheck,
  UserX,
  Loader2,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getConnections,
  updateConnectionStatus,
  Connection,
} from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function ConnectionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user]);

  const fetchConnections = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await getConnections(user.uid, user.role);
      setConnections(data);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    connectionId: string,
    status: "accepted" | "rejected"
  ) => {
    setActionLoading(connectionId);
    try {
      const result = await updateConnectionStatus(connectionId, status);
      if (result.success) {
        toast({
          title: "Success",
          description: `Connection ${status}`,
        });
        fetchConnections();
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
        description: "Failed to update connection",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const pendingConnections = connections.filter((c) => c.status === "pending");
  const acceptedConnections = connections.filter((c) => c.status === "accepted");

  const getOtherUser = (connection: Connection) => {
    return user?.role === "teacher" ? connection.student : connection.teacher;
  };

  const isIncomingRequest = (connection: Connection) => {
    return connection.requestedBy !== user?.uid;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Connections</h1>
          <p className="text-muted-foreground">
            Manage your connections with{" "}
            {user?.role === "teacher" ? "students" : "teachers"}
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {acceptedConnections.length} Connected
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" />
            Pending ({pendingConnections.length})
          </TabsTrigger>
          <TabsTrigger value="connected" className="gap-2">
            <UserCheck className="w-4 h-4" />
            Connected ({acceptedConnections.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Requests */}
        <TabsContent value="pending" className="mt-6">
          {pendingConnections.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserPlus className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No pending requests
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Use the search bar to find and connect with{" "}
                  {user?.role === "teacher" ? "students" : "teachers"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingConnections.map((connection) => {
                const otherUser = getOtherUser(connection);
                const isIncoming = isIncomingRequest(connection);

                return (
                  <motion.div
                    key={connection.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12 border-2 border-primary/20">
                            <AvatarImage src={otherUser?.profileImage || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                              {getInitials(otherUser?.displayName || "U")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground truncate">
                                {otherUser?.displayName}
                              </p>
                              <Badge
                                variant={
                                  otherUser?.role === "teacher"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs capitalize"
                              >
                                {otherUser?.role === "teacher" ? (
                                  <Users className="w-3 h-3 mr-1" />
                                ) : (
                                  <GraduationCap className="w-3 h-3 mr-1" />
                                )}
                                {otherUser?.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {otherUser?.email}
                            </p>
                            
                            {connection.message && (
                              <div className="mt-2 p-2 rounded-lg bg-accent/50 text-sm">
                                <MessageSquare className="w-3 h-3 inline-block mr-1 text-muted-foreground" />
                                {connection.message}
                              </div>
                            )}

                            <p className="text-xs text-muted-foreground mt-2">
                              {isIncoming ? "Received" : "Sent"}{" "}
                              {new Date(connection.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {isIncoming && (
                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              className="flex-1 gap-1"
                              onClick={() =>
                                handleStatusUpdate(connection.id, "accepted")
                              }
                              disabled={actionLoading === connection.id}
                            >
                              {actionLoading === connection.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  Accept
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 gap-1"
                              onClick={() =>
                                handleStatusUpdate(connection.id, "rejected")
                              }
                              disabled={actionLoading === connection.id}
                            >
                              <XCircle className="w-4 h-4" />
                              Decline
                            </Button>
                          </div>
                        )}

                        {!isIncoming && (
                          <div className="mt-4">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              Waiting for response
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Connected */}
        <TabsContent value="connected" className="mt-6">
          {acceptedConnections.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserCheck className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No connections yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start connecting with{" "}
                  {user?.role === "teacher" ? "students" : "teachers"} to see
                  them here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {acceptedConnections.map((connection) => {
                const otherUser = getOtherUser(connection);

                return (
                  <motion.div
                    key={connection.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-14 h-14 border-2 border-green-500/30">
                            <AvatarImage src={otherUser?.profileImage || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-lg">
                              {getInitials(otherUser?.displayName || "U")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {otherUser?.displayName}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {otherUser?.email}
                            </p>
                            <Badge
                              variant="outline"
                              className="mt-1 text-xs text-green-600 border-green-300"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Connected
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1 gap-1">
                            <MessageSquare className="w-4 h-4" />
                            Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
