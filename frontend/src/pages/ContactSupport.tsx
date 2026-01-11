import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function ContactSupportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "student");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/support/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, category, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unknown error");
      toast({ title: "Message sent", description: "Support will contact you shortly." });
      setMessage("");
      if (data?.previewUrl) {
        console.log("Email preview URL:", data.previewUrl);
        setPreviewUrl(data.previewUrl);
        toast({ title: "Preview available", description: "A preview of the message was created for development." });
      } else {
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: err.message || "Failed to send message", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>Send us a message and our team will reach out.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Role</label>
              <Select value={role} onValueChange={(val) => setRole(val)}>
                <SelectTrigger>
                  <SelectValue>{role}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Category</label>
              <Select value={category} onValueChange={(val) => setCategory(val)}>
                <SelectTrigger>
                  <SelectValue>{category}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Message</label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Send Message"}</Button>
            </div>
          </form>
          {previewUrl && (
            <div className="mt-4 text-sm">
              <div className="text-muted-foreground">Development preview:</div>
              <a className="text-primary" href={previewUrl} target="_blank" rel="noreferrer">Open email preview</a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
