import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getUserProfilePage,
  updateProfessionalDetails,
} from "@/services/userService";
import { getProgressMetrics } from "@/services/progressService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  GraduationCap,
  User,
  Camera,
  ArrowLeft,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------------------------------- */
export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  /* Editable fields */

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");


const [city, setCity] = useState("");
const [stateName, setStateName] = useState("");
const [preferredLanguage, setPreferredLanguage] = useState("");

const [userClass, setUserClass] = useState("");
const [board, setBoard] = useState("");
const [stream, setStream] = useState("");
const [school, setSchool] = useState("");
const [section, setSection] = useState("");
const [academicYear, setAcademicYear] = useState("");
const [dob, setDob] = useState("");
const [loading, setLoading] = useState(true);
const formatDate = (date?: string) => {
  if (!date) return "Not set";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Not set";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


const pluralize = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

useEffect(() => {
  if (!user?.uid) return;

  const load = async () => {
    setLoading(true);

    const p = await getUserProfilePage();
    const m = await getProgressMetrics();

    setProfile(p);
    setMetrics(m);

    setUserClass(p?.class ?? "");
    setDob(p?.dob ?? "");
    setPhone(p?.phone ?? "");
    setCity(p?.city ?? "");
    setStateName(p?.state ?? "");
    setPreferredLanguage(p?.preferredLanguage ?? "");
    setBoard(p?.board ?? "");
    setStream(p?.stream ?? "");
    setSchool(p?.school ?? "");
    setSection(p?.section ?? "");
    setAcademicYear(p?.academicYear ?? "");

    if (user.role === "student" && (!p?.phone || !p?.dob || !p?.class)) {
      setIsEditing(true);
    }

    setLoading(false);
  };

  load();
}, [user?.uid]);

if (loading) {
  return <div className="py-20 text-center">Loading profile…</div>;
}

  if (!user) return null;

  /* ---------- Profile completion ---------- */
  // const completionFields = [
  //   user.displayName,
  //   user.email,
  //   profile?.class,
  //   profile?.dob,
  //   profile?.phone,
  //   profile?.address,
  // ];
const completionFields =
  user.role === "student"
    ? [
        user.displayName,
        user.email,
        profile?.class,
        profile?.dob,
        profile?.phone,
        profile?.city,
      ]
    : [
        user.displayName,
        user.email,
        profile?.phone,
        profile?.city,
      ];


  const completion =
    (completionFields.filter(Boolean).length / completionFields.length) * 100;

  return (
    <div className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back */}
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* HEADER */}
    <Card className="rounded-3xl overflow-hidden">
  <div className="bg-gradient-to-r from-primary to-purple-600 h-36" />

  <CardContent className="-mt-20 flex gap-6 items-center p-8">
    {/* Avatar */}
    <div className="relative group cursor-pointer">
      <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
        <AvatarImage src="/placeholder.svg" />
        <AvatarFallback className="text-4xl">
          {user.displayName?.[0]}
        </AvatarFallback>
      </Avatar>

      <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm">
        Change photo
      </div>
    </div>

    {/* Identity */}
    <div className="flex-1 space-y-1">
      <h1 className="text-3xl font-bold">{user.displayName}</h1>

      <div className="flex gap-2 flex-wrap">
        <Badge>{user.role}</Badge>
        {profile?.class && (
          <Badge variant="secondary">Class {profile.class}</Badge>
        )}
      </div>

      <p className="flex items-center gap-2 text-muted-foreground">
        <Mail className="w-4 h-4" />
        {user.email}
      </p>
    </div>

    <Button size="lg" onClick={() => setIsEditing(true)}>
      Edit Profile
    </Button>
  </CardContent>
</Card>

{user.role === "student" && (
  <Card className="rounded-xl">
    <CardContent className="p-5 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Profile Completion</h3>
        <span className="text-sm text-muted-foreground">
          {Math.round(completion)}%
        </span>
      </div>

      <Progress value={completion} />

      {completion < 100 && (
        <p className="text-sm text-muted-foreground">
          Missing:{" "}
          {[
            !profile?.class && "Class",
            !profile?.dob && "Date of Birth",
            !profile?.phone && "Phone",
            !profile?.address && "Address",
          ]
            .filter(Boolean)
            .join(", ")}
        </p>
      )}
    </CardContent>
  </Card>
)}
       <div
  className={
    user.role === "student"
      ? "grid md:grid-cols-3 gap-6"
      : "flex flex-col gap-6"
  }
>

  {/* PERSONAL INFO — always visible */}
  <Card>
    <CardContent className="p-6 space-y-2">
      <h2 className="font-semibold flex gap-2">
        <User className="w-5 h-5" />
        Personal Info
      </h2>

      <InfoRow label="Name" value={user.displayName} />
      <InfoRow label="Email" value={user.email} />
      <InfoRow label="Role" value={user.role} />
      <InfoRow label="Phone" value={profile?.phone || "Not set"} />
      <InfoRow
        label="Location"
        value={
          profile?.city && profile?.state
            ? `${profile.city}, ${profile.state}`
            : "Not set"
        }
      />
      <InfoRow
        label="Preferred Language"
        value={profile?.preferredLanguage || "Not set"}
      />
    </CardContent>
  </Card>

  {/* STUDENT-ONLY SECTIONS */}
  {user.role === "student" && (
    <>
      {/* Academic Details */}
      <Card>
        <CardContent className="p-6 space-y-2">
          <h2 className="font-semibold flex gap-2">
            <GraduationCap className="w-5 h-5" />
            Academic Details
          </h2>

          <InfoRow label="Class" value={profile?.class || "Not set"} />
          <InfoRow label="Board" value={profile?.board || "Not set"} />
          <InfoRow label="Stream" value={profile?.stream || "Not set"} />
          <InfoRow label="Section" value={profile?.section || "Not set"} />
          <InfoRow label="School / College" value={profile?.school || "Not set"} />
          <InfoRow label="Academic Year" value={profile?.academicYear || "Not set"} />
          <InfoRow label="Date of Birth" value={formatDate(profile?.dob)} />
        </CardContent>
      </Card>

      {/* Study Activity */}
      <Card>
        <CardContent className="p-6 space-y-2">
          <h2 className="font-semibold flex gap-2">
            <Activity className="w-5 h-5" />
            Study Activity
          </h2>

          {metrics?.totalMinutes > 0 ? (
            <>
              <InfoRow
                label="Study Streak"
                value={`${metrics.currentStreak} ${
                  metrics.currentStreak === 1 ? "day" : "days"
                } 🔥`}
              />
              <InfoRow
                label="Total Study Time"
                value={`${Math.floor(metrics.totalMinutes / 60)} hrs`}
              />
              <InfoRow label="Last Active" value={metrics.lastActiveLabel} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              You haven’t studied with <b>StudySync</b> yet.  
              Start a 25-minute focus session 🚀
            </p>
          )}
        </CardContent>
      </Card>
    </>
  )}
</div>

        {/* EDIT MODAL */}
     {isEditing && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
    <Card className="w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
      
      {/* HEADER */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Edit Profile</h2>
        <p className="text-sm text-muted-foreground">
          Complete your details for a better learning experience
        </p>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Personal */}
        <Section title="Personal Info">
          <Field label="Phone" value={phone} setValue={setPhone} />
          <Field label="City" value={city} setValue={setCity} />
          <Field label="State" value={stateName} setValue={setStateName} />
          <Field
            label="Preferred Language"
            value={preferredLanguage}
            setValue={setPreferredLanguage}
          />
        </Section>

        {/* Academic */}
        <Section title="Academic Details">
          <Field label="Class / Grade" value={userClass} setValue={setUserClass} />
          <Field label="Board" value={board} setValue={setBoard} />
          <Field label="Stream" value={stream} setValue={setStream} />
          <Field label="School / College" value={school} setValue={setSchool} />
          <Field label="Section" value={section} setValue={setSection} />
          <Field label="Academic Year" value={academicYear} setValue={setAcademicYear} />
          <DateField label="Date of Birth" value={dob} setValue={setDob} />
        </Section>
      </div>

      {/* FOOTER */}
      <div className="p-6 border-t flex justify-end gap-3 bg-background">
        <Button variant="outline" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
       <Button
  onClick={async () => {
    const payload =
      user.role === "student"
        ? {
            class: userClass,
            dob,
            phone,
            city,
            state: stateName,
            preferredLanguage,
            board,
            stream,
            school,
            section,
            academicYear,
          }
        : {
            phone,
            city,
            state: stateName,
            preferredLanguage,
          };

    await updateProfessionalDetails(payload);

    const updatedProfile = await getUserProfilePage();
    setProfile(updatedProfile);

    setIsEditing(false);
  }}
>
  Save Changes
</Button>
      </div>
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
function InfoRowIcon({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) {
  return (
    <div className="grid grid-cols-[20px_1fr_auto] gap-3 py-2 border-b last:border-b-0">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right">
        {value || "Not set"}
      </span>
    </div>
  );
}

function Field({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function DateField({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
