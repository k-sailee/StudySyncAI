import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/config/firebase";
import { useToast } from "@/hooks/use-toast";
import StudyGroupCard from "@/components/dashboard/StudyGroupCard";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import axios from "axios";
import GroupChatPage from "./GroupChat";

// local subject -> gradient helper (same logic as StudyGroupCard)
const subjectColor = (subject: string) => {
  if (!subject) return "from-violet-500 to-purple-600";
  const s = subject.toLowerCase();
  if (s.includes("math")) return "from-blue-500 to-cyan-500";
  if (s.includes("physics")) return "from-orange-500 to-red-500";
  if (s.includes("computer")) return "from-emerald-500 to-teal-500";
  return "from-violet-500 to-purple-600";
};

const formatDate = (iso?: string) => {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString(); } catch { return iso; }
};

export default function StudyGroupsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [membersProfiles, setMembersProfiles] = useState<any[]>([]);
  const [adminProfile, setAdminProfile] = useState<any | null>(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      if (!user) throw new Error("Not authenticated");
      const token = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`/studygroups/`, { headers: { Authorization: `Bearer ${token || ""}` } });
      if (data) {
        let list = data.groups || [];
        // client-side filter: public/my groups/all
        if (filter === "public") list = list.filter((g) => g.visibility === "public");
        if (filter === "mine") list = list.filter((g) => g.members?.some((m) => m.userId === user?.uid) || g.organizerId === user?.uid);
        if (query) list = list.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()) || (g.subject || "").toLowerCase().includes(query.toLowerCase()));
        setGroups(list);
      } else throw new Error(data?.message || "Failed to load");
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: err.message || "Failed to load groups", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGroups(); }, [filter]);

  const create = async () => {
    try {
      setCreating(true);
      if (!user) throw new Error("Not authenticated");
      const token = await auth.currentUser?.getIdToken();
      const { data } = await axios.post(`/studygroups/`, { name, subject, visibility: "public" }, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` } });
      if (!data) throw new Error(data?.message || "Failed to create");
      toast({ title: "Created", description: "Study group created" });
      setName(""); setSubject("");
      fetchGroups();
    } catch (err) {
      toast({ title: "Error", description: err.message || "Failed to create", variant: "destructive" });
    } finally { setCreating(false); }
  };

  const handleJoin = async (id: string) => {
    const prev = groups;
    try {
      setJoiningId(id);
      if (!user) throw new Error("Not authenticated");

      // Optimistically update local groups so the UI shows Joined immediately
      setGroups((prevG) => prevG.map((g) => {
        if (g.id !== id) return g;
        const already = Array.isArray(g.members) ? g.members.some((m) => m.userId === user?.uid) : false;
        if (already) return g;
        const updatedMembers = Array.isArray(g.members) ? [...g.members, { userId: user?.uid, role: 'member', joinedAt: new Date().toISOString() }] : [{ userId: user?.uid, role: 'member', joinedAt: new Date().toISOString() }];
        return { ...g, members: updatedMembers, memberCount: (g.memberCount || updatedMembers.length) };
      }));

      // If the detail sheet is open for this group, update membersProfiles/selectedGroup locally
      if (selectedGroup?.id === id) {
        setMembersProfiles((prevM) => {
          if (prevM.some((m) => m.uid === user?.uid)) return prevM;
          return [...prevM, { uid: user?.uid, displayName: user?.displayName || user?.uid, role: 'member' }];
        });
        setSelectedGroup((s) => s ? { ...s, memberCount: (s.memberCount || 0) + 1 } : s);
      }

      const token = await auth.currentUser?.getIdToken();
      const { data: d } = await axios.post(`/studygroups/${id}/join`, null, { headers: { Authorization: `Bearer ${token || ""}` } });
      if (!d) {
        // rollback optimistic changes
        setGroups(prev);
        if (selectedGroup?.id === id) {
          setMembersProfiles((prevM) => prevM.filter((m) => m.uid !== user?.uid));
          setSelectedGroup((s) => s ? { ...s, memberCount: Math.max(0, (s.memberCount || 0) - 1) } : s);
        }
        throw new Error(d?.message || "Failed to join");
      }

      toast({ title: "Success", description: d.message });

      // Optionally open detail sheet (keeps UX similar to before)
      openGroup(id);
    } catch (err) {
      toast({ title: "Error", description: err.message || "Failed", variant: "destructive" });
    } finally { setJoiningId(null); }
  };

  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this study group? This cannot be undone.");
      if (!confirmDelete) return;
      setJoiningId(id);
      if (!user) throw new Error("Not authenticated");
      const token = await auth.currentUser?.getIdToken();
      const response = await axios.delete(`/studygroups/${id}`, { headers: { Authorization: `Bearer ${token || ""}` } });
      const d = response.data;
      if (response.status >= 400) throw new Error(d?.message || "Failed to delete");
      toast({ title: "Deleted", description: d.message || "Group deleted" });
      fetchGroups();
    } catch (err) {
      toast({ title: "Error", description: err.message || "Failed to delete", variant: "destructive" });
    } finally {
      setJoiningId(null);
    }
  };

  const openGroup = async (id: string) => {
    try {
      setDetailLoading(true);
      setSheetOpen(true);
      setSelectedGroup(null);
      setMembersProfiles([]);
      setAdminProfile(null);

      const token = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`/studygroups/${id}`, { headers: { Authorization: `Bearer ${token || ""}` } });
      if (!data) throw new Error(data?.message || "Failed to load group");

      const group = data.group;
      // include backend-provided isMember flag so embedded chat knows membership immediately
      setSelectedGroup({ ...group, isMember: Boolean(data.isMember) });

      // fetch admin profile
      try {
        const { data: adminData } = await axios.get(`/users/${group.organizerId}`);
        if (adminData) setAdminProfile(adminData.user);
      } catch (e) {
        console.warn('Failed to fetch admin profile', e);
      }

      // fetch member profiles (limit 30)
      const members = data.members || [];
      const profs = await Promise.all(members.slice(0,30).map(async (m) => {
        try {
          const { data: jd } = await axios.get(`/users/${m.userId}`);
          return { uid: m.userId, displayName: jd.user?.displayName || m.userId, role: m.role };
        } catch (e) {
          return { uid: m.userId, displayName: m.userId, role: m.role };
        }
      }));
      setMembersProfiles(profs.filter(Boolean));
    } catch (err) {
      toast({ title: "Error", description: err.message || "Failed to load group", variant: "destructive" });
      setSheetOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  // Called when embedded GroupChat reports a successful join
  const handleGroupChatJoinSuccess = (id: string) => {
    if (!user) return;
    setGroups((prev) => prev.map((g) => {
      if (g.id !== id) return g;
      const already = Array.isArray(g.members) ? g.members.some((m) => m.userId === user?.uid) : false;
      if (already) return { ...g, memberCount: (g.memberCount || (g.members?.length||0)) };
      const updatedMembers = Array.isArray(g.members) ? [...g.members, { userId: user.uid, role: 'member', joinedAt: new Date().toISOString() }] : [{ userId: user.uid, role: 'member', joinedAt: new Date().toISOString() }];
      return { ...g, members: updatedMembers, memberCount: (g.memberCount || updatedMembers.length) };
    }));

    // update selected group and membersProfiles if open
    if (selectedGroup?.id === id) {
      setSelectedGroup((s) => s ? { ...s, isMember: true, memberCount: (s.memberCount || 0) + 1 } : s);
      setMembersProfiles((prevM) => prevM.some((m) => m.uid === user.uid) ? prevM : [...prevM, { uid: user.uid, displayName: user.displayName || user.uid, role: 'member' }]);
    }
  };

  // Called when embedded GroupChat reports a successful leave
  const handleGroupChatLeaveSuccess = (id: string) => {
    if (!user) return;
    setGroups((prev) => prev.map((g) => {
      if (g.id !== id) return g;
      const updatedMembers = Array.isArray(g.members) ? g.members.filter((m) => m.userId !== user?.uid) : [];
      return { ...g, members: updatedMembers, memberCount: Math.max(0, (g.memberCount || updatedMembers.length) - 1) };
    }));

    if (selectedGroup?.id === id) {
      setMembersProfiles((prevM) => prevM.filter((m) => m.uid !== user.uid));
      // close the sheet since user left
      setSheetOpen(false);
      setSelectedGroup(null);
    }
  };

  const handleLeave = async (id: string) => {
    const prev = groups;
    try {
      if (!user) throw new Error('Not authenticated');

      // Optimistically update local groups to remove membership immediately
      setGroups((prevG) => prevG.map((g) => {
        if (g.id !== id) return g;
        const updatedMembers = Array.isArray(g.members) ? g.members.filter((m) => m.userId !== user?.uid) : [];
        return { ...g, members: updatedMembers, memberCount: Math.max(0, (g.memberCount || 0) - 1) };
      }));

      // If the detail sheet is open for this group, update membersProfiles/selectedGroup locally
      if (selectedGroup?.id === id) {
        setMembersProfiles((prevM) => prevM.filter((m) => m.uid !== user?.uid));
        setSelectedGroup((s) => s ? { ...s, memberCount: Math.max(0, (s.memberCount || 0) - 1) } : s);
      }

      const token = await auth.currentUser?.getIdToken();
      const { data: d } = await axios.post(`/studygroups/${id}/leave`, null, { headers: { Authorization: `Bearer ${token || ''}` } });
      if (!d) {
        // rollback optimistic changes
        setGroups(prev);
        if (selectedGroup?.id === id) {
          // re-add member locally (best-effort)
          setMembersProfiles((prevM) => {
            if (prevM.some((m) => m.uid === user?.uid)) return prevM;
            return [...prevM, { uid: user?.uid, displayName: user?.displayName || user?.uid, role: 'member' }];
          });
          setSelectedGroup((s) => s ? { ...s, memberCount: (s.memberCount || 0) + 1 } : s);
        }
        throw new Error(d?.message || 'Failed to leave');
      }

      toast({ title: 'Left', description: d.message });
    } catch (err) {
      toast({ title: 'Error', description: err.message || 'Failed to leave', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Study Groups</h2>
          <p className="text-sm text-muted-foreground">Join or create study groups, collaborate on assignments, and learn together.</p>
        </div>

        <div className="flex items-center gap-3">
          <Input placeholder="Search groups..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="bg-muted rounded-lg p-1 flex gap-1">
            <button className={`px-3 py-1 rounded ${filter==='all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`} onClick={() => setFilter('all')}>All</button>
            <button className={`px-3 py-1 rounded ${filter==='public' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`} onClick={() => setFilter('public')}>Public</button>
            <button className={`px-3 py-1 rounded ${filter==='mine' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`} onClick={() => setFilter('mine')}>My Groups</button>
          </div>
          <Dialog>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Study Group</DialogTitle>
                <DialogDescription>Create a new study group for your class or topic.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <DialogFooter>
                <div className="flex gap-2">
                  <Button variant="ghost">Cancel</Button>
                  <Button onClick={create} disabled={creating}>{creating ? 'Creating...' : 'Create'}</Button>
                </div>
              </DialogFooter>
            </DialogContent>
            <DialogTrigger asChild>
              <Button>Create Group</Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((g) => (
          <StudyGroupCard
            key={g.id}
            group={{ ...g, memberCount: g.members?.length }}
            onJoin={handleJoin}
            joining={joiningId === g.id}
            isMember={g.organizerId === user?.uid || g.members?.some?.((m) => m.userId === user?.uid)}
            requestSent={false}
            isAdmin={g.organizerId === user?.uid}
            onDelete={handleDelete}
            onLeave={handleLeave}
            onOpen={openGroup}
          />
        ))}
      </div>

      <Sheet open={sheetOpen} onOpenChange={(o) => { if (!o) { setSheetOpen(false); setSelectedGroup(null); } setSheetOpen(o); }}>
          <SheetContent side="right" className="p-0">
            {/* Render chat UI inside the sheet */}
            {selectedGroup ? (
              <div className="h-full">
                <GroupChatPage
                  groupId={selectedGroup.id}
                  initialGroup={selectedGroup}
                  initialIsMember={Boolean(selectedGroup.isMember) || membersProfiles.some((m) => m.uid === user?.uid)}
                  initialMembers={membersProfiles}
                  hideHeader={false}
                  onJoinSuccess={handleGroupChatJoinSuccess}
                  onLeaveSuccess={handleGroupChatLeaveSuccess}
                />
              </div>
            ) : (
              <div className="p-6">Loading...</div>
            )}
          </SheetContent>
      </Sheet>
    </div>
  );
}
