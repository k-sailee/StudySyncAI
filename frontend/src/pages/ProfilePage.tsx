
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  GraduationCap,
  User,
  Camera,
  ArrowLeft,
  Activity,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user,updateProfile  } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  if (!user) return null;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 dark:bg-background py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Header Card */}
        <Card className="rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-purple-600 h-28" />

          <CardContent className="p-6 -mt-16 flex flex-col md:flex-row gap-6 items-center md:items-end">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-28 h-28 border-4 border-background shadow-lg">
                <AvatarImage src={avatarPreview || "/placeholder.svg"} />
                <AvatarFallback className="text-3xl font-bold">
                  {user.displayName?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>

              <label className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full cursor-pointer shadow">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl font-bold">{user.displayName}</h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="secondary" className="capitalize">
                  {user.role}
                </Badge>
                {user.role === "student" && (
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                    Grade 11 – Science
                  </Badge>
                )}
              </div>
              <p className="flex items-center gap-2 text-muted-foreground justify-center md:justify-start">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
            </div>

            <Button size="lg" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Personal Info */}
          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Info
              </h2>
              <InfoRow label="Full Name" value={user.displayName} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Role" value={user.role} />
            </CardContent>
          </Card>

          {/* Academic / Professional */}
          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                {user.role === "student" ? "Academic Details" : "Professional Details"}
              </h2>

              {user.role === "student" ? (
                <>
                  <InfoRow label="Grade" value="11" />
                  <InfoRow label="Stream" value="Science" />
                  <InfoRow label="Courses" value="4" />
                </>
              ) : (
                <>
                  <InfoRow label="Subject" value="Mathematics" />
                  <InfoRow label="Classes" value="5" />
                  <InfoRow label="Students" value="156" />
                </>
              )}
            </CardContent>
          </Card>

          {/* Activity */}
          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Activity
              </h2>
              <InfoRow label="Study Streak" value="12 days 🔥" />
              <InfoRow label="Tasks Completed" value="48" />
              <InfoRow label="Last Active" value="Today" />
            </CardContent>
          </Card>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <Card className="w-full max-w-md rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Edit Profile</h2>

                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button
  onClick={() => {
    updateProfile({
      displayName: name,
      email,
    });
    setIsEditing(false);
  }}
>
  Save Changes
</Button>

                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
