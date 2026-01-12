import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/config/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { auth as fbAuth } from "@/config/firebase";
import { useToast } from "@/hooks/use-toast";

type Props = {
  groupId?: string;
  initialGroup?: any;
  initialIsMember?: boolean;
  initialMembers?: any[];
  hideHeader?: boolean;
  onJoinSuccess?: (groupId: string) => void;
  onLeaveSuccess?: (groupId: string) => void;
};

export default function GroupChatPage({ groupId: propGroupId, initialGroup, initialIsMember, initialMembers, hideHeader, onJoinSuccess, onLeaveSuccess }: Props) {
  const params = useParams();
  const id = propGroupId || params.id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [group, setGroup] = useState<any | null>(initialGroup || null);
  const [isMember, setIsMember] = useState<boolean>(Boolean(initialIsMember));
  const [members, setMembers] = useState<any[]>(initialMembers || []);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const unsubRef = useRef<() => void | null>(null);

  useEffect(() => {
    if (!id) return;

    // if initialGroup provided, use it; otherwise fetch
    if (!initialGroup) {
      (async () => {
        try {
          const token = await fbAuth.currentUser?.getIdToken();
          const res = await fetch(`/api/studygroups/${id}`, { headers: { Authorization: `Bearer ${token || ""}` } });
          const d = await res.json();
          if (!res.ok) throw new Error(d?.message || "Failed to load group");
          setGroup(d.group);
          setIsMember(Boolean(d.isMember));
          setMembers(d.members || []);

          if (d.isMember) subscribeMessages(id);
        } catch (err) {
          toast({ title: "Error", description: err.message || "Failed to load group", variant: "destructive" });
        }
      })();
    } else {
      // initial data was provided
      if (initialIsMember) subscribeMessages(id);
    }

    return () => { if (unsubRef.current) unsubRef.current(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function subscribeMessages(groupId: string) {
    const q = query(collection(db, `studyGroups/${groupId}/messages`), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const msgs: any[] = [];
      snap.docs.forEach((doc) => msgs.push({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 50);
    }, (err) => {
      console.error('Messages snapshot error', err);
      toast({ title: 'Error', description: 'Failed to load messages', variant: 'destructive' });
    });
    unsubRef.current = unsub;
  }

  const handleJoin = async () => {
    try {
      const token = await fbAuth.currentUser?.getIdToken();
      const res = await fetch(`/api/studygroups/${id}/join`, { method: 'POST', headers: { Authorization: `Bearer ${token || ""}` } });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.message || 'Failed to join');
      setIsMember(true);
      setMembers((prev) => [...prev, { uid: user?.uid, displayName: user?.displayName || user?.uid, role: 'member' }]);
      subscribeMessages(id!);
      // notify parent that join succeeded so parent UI (card/list) can update
      try { onJoinSuccess?.(id!); } catch (e) { /* ignore parent errors */ }
    } catch (err) {
      toast({ title: 'Error', description: err.message || 'Failed to join', variant: 'destructive' });
    }
  };

  const handleLeave = async () => {
    try {
      const token = await fbAuth.currentUser?.getIdToken();
      const res = await fetch(`/api/studygroups/${id}/leave`, { method: 'POST', headers: { Authorization: `Bearer ${token || ""}` } });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.message || 'Failed to leave');
      if (unsubRef.current) unsubRef.current();
        // If parent provided a handler for leave (embedded), call it so parent can update UI and close sheet.
        try {
          if (onLeaveSuccess) {
            onLeaveSuccess(id!);
            return;
          }
        } catch (e) { /* ignore */ }

        // fallback: navigate to dashboard
        navigate('/dashboard');
    } catch (err) {
      toast({ title: 'Error', description: err.message || 'Failed to leave', variant: 'destructive' });
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      setSending(true);
      const token = await fbAuth.currentUser?.getIdToken();
      const res = await fetch(`/api/studygroups/${id}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ""}` }, body: JSON.stringify({ text: text.trim() }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.message || 'Failed to send');
      setText('');
    } catch (err) {
      toast({ title: 'Error', description: err.message || 'Failed to send', variant: 'destructive' });
    } finally { setSending(false); }
  };

  return (
    <div className="h-full flex flex-col bg-surface">
      {!hideHeader && (
        <header className="flex items-center justify-between p-3 border-b border-border">
          <div>
            <div className="font-semibold">{group?.name || 'Group'}</div>
            <div className="text-xs text-muted-foreground max-w-md overflow-auto whitespace-nowrap">{members.map((m) => m.displayName || m.userId).join(', ')}</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2">⋮</button>
          </div>
        </header>
      )}

      <main className="flex-1 overflow-hidden flex flex-col">
        {isMember ? (
          <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`max-w-3/4 ${m.senderId === user?.uid ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
                {m.senderId !== user?.uid && <div className="text-xs text-muted-foreground">{m.senderName}</div>}
                <div className="inline-block bg-primary/10 px-3 py-2 rounded-lg">{m.text}</div>
                <div className="text-xs text-muted-foreground mt-1">{m.createdAt?.toDate ? m.createdAt.toDate().toLocaleTimeString() : (new Date(m.createdAt?.seconds ? m.createdAt.seconds * 1000 : Date.now())).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-4">You are not a member of this group.</div>
              <button className="btn" onClick={handleJoin}>Join Group</button>
            </div>
          </div>
        )}
      </main>

      {isMember && (
        <div className="p-3 border-t border-border flex items-center gap-2">
          <button className="p-2">😊</button>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message" className="flex-1 px-3 py-2 rounded-lg border" />
          <button onClick={handleSend} disabled={sending} className="px-4 py-2 bg-primary text-white rounded-lg">Send</button>
          <button onClick={handleLeave} className="px-3 py-2 text-destructive">Leave</button>
        </div>
      )}
    </div>
  );
}
