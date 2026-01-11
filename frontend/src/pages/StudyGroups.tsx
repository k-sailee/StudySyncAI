import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/config/firebase";
import { useToast } from "@/hooks/use-toast";
import StudyGroupCard from "@/components/dashboard/StudyGroupCard";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

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
      const res = await fetch(`/api/studygroups/`, { headers: { Authorization: `Bearer ${token || ""}` } });
      const data = await res.json();
      if (res.ok) {
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
      const res = await fetch(`/api/studygroups/`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` }, body: JSON.stringify({ name, subject, visibility: "public" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create");
      toast({ title: "Created", description: "Study group created" });
      setName(""); setSubject("");
      fetchGroups();
    } catch (err) {
      toast({ title: "Error", description: err.message || "Failed to create", variant: "destructive" });
    } finally { setCreating(false); }
  };

  const handleJoin = async (id: string) => {
    try {
      setJoiningId(id);
      if (!user) throw new Error("Not authenticated");
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/studygroups/${id}/join`, { method: "POST", headers: { Authorization: `Bearer ${token || ""}` } });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.message || "Failed");
      toast({ title: "Success", description: d.message });
      // Refresh list and open drawer for the group
      fetchGroups();
      openGroup(id);
    } catch (err) { toast({ title: "Error", description: err.message || "Failed", variant: "destructive" }); }
    finally { setJoiningId(null); }
  };

  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this study group? This cannot be undone.");
      if (!confirmDelete) return;
      setJoiningId(id);
      if (!user) throw new Error("Not authenticated");
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/studygroups/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token || ""}` } });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.message || "Failed to delete");
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
      const res = await fetch(`/api/studygroups/${id}`, { headers: { Authorization: `Bearer ${token || ""}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load group");

      const group = data.group;
      setSelectedGroup(group);

      // fetch admin profile
      try {
        const adminRes = await fetch(`/api/users/${group.organizerId}`);
        const adminData = await adminRes.json();
        if (adminRes.ok) setAdminProfile(adminData.user);
      } catch (e) {
        console.warn('Failed to fetch admin profile', e);
      }

      // fetch member profiles (limit 30)
      const members = data.members || [];
      const profs = await Promise.all(members.slice(0,30).map(async (m) => {
        try {
          const r = await fetch(`/api/users/${m.userId}`);
          const jd = await r.json();
          if (r.ok) return { uid: m.userId, displayName: jd.user?.displayName || m.userId, role: m.role };
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

  const handleLeave = async (id: string) => {
    try {
      if (!user) throw new Error('Not authenticated');
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/studygroups/${id}/leave`, { method: 'POST', headers: { Authorization: `Bearer ${token || ''}` } });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.message || 'Failed to leave');
      toast({ title: 'Left', description: d.message });
      fetchGroups();
      if (selectedGroup?.id === id) openGroup(id);
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
            isMember={g.members?.some?.((m) => m.userId === user?.uid)}
            requestSent={false}
            isAdmin={g.organizerId === user?.uid}
            onDelete={handleDelete}
            onOpen={openGroup}
          />
        ))}
      </div>

      <Sheet open={sheetOpen} onOpenChange={(o) => { if (!o) { setSheetOpen(false); setSelectedGroup(null); } setSheetOpen(o); }}>
        <SheetContent side="right">
          {/* Gradient header */}
          <div className={`h-28 bg-gradient-to-br ${selectedGroup ? (selectedGroup.subject?.toLowerCase().includes('math') ? 'from-blue-500 to-cyan-500' : selectedGroup.subject?.toLowerCase().includes('physics') ? 'from-orange-500 to-red-500' : 'from-violet-500 to-purple-600') : 'from-violet-500 to-purple-600'} p-4 flex items-start justify-between`}> 
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white text-lg font-semibold">{selectedGroup ? selectedGroup.name : 'Loading...'}</div>
                <div className="text-white/80 text-sm">{selectedGroup?.subject}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white`}>{selectedGroup?.visibility === 'public' ? 'Public' : 'Private'}</div>
              <Sheet.Close asChild>
                <Button variant="ghost" size="icon" aria-label="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </Button>
              </Sheet.Close>
            </div>
          </div>

          <div className="px-6 pt-4 pb-24 space-y-4">
            {/* Meta row */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /> <span>{membersProfiles.length} members</span></div>
                <div className="text-xs">{selectedGroup?.subject}</div>
              </div>
              <div className="text-xs">{selectedGroup?.createdAt ? new Date(selectedGroup.createdAt).toLocaleDateString() : ''}</div>
            </div>

            {/* Admin card */}
            <div className="bg-card rounded-lg p-3 flex items-center gap-3 border border-border">
              <Avatar>
                <AvatarFallback>{adminProfile?.displayName?.slice(0,2) || 'AD'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm font-medium">{adminProfile?.displayName || selectedGroup?.organizerId}</div>
                <div className="text-xs text-muted-foreground">Organizer</div>
              </div>
            </div>

            {/* Members list */}
            <div>
              <div className="text-sm font-medium">Members</div>
              <div className="mt-3 max-h-56 overflow-auto divide-y divide-border rounded-md">
                {membersProfiles.length === 0 && <div className="p-3 text-sm text-muted-foreground">No members yet</div>}
                {membersProfiles.map((m) => (
                  <div key={m.uid} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback>{m.displayName?.slice(0,2) || m.uid.slice(0,2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{m.displayName}</div>
                        <div className="text-xs text-muted-foreground">{m.role}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{m.uid === selectedGroup?.organizerId ? 'organizer' : 'member'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky bottom action bar */}
          <div className="absolute left-0 right-0 bottom-0 px-6 py-4 bg-gradient-to-t from-background/80 to-transparent backdrop-blur-sm border-t border-border">
            <div className="max-w-2xl mx-auto flex items-center justify-end gap-3">
              {selectedGroup && membersProfiles.some((m) => m.uid === user?.uid) ? (
                <Button variant="outline" onClick={() => handleLeave(selectedGroup.id)}>Leave</Button>
              ) : (
                <Button onClick={() => handleJoin(selectedGroup.id)}>Join</Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
