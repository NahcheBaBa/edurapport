import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, GraduationCap, BookOpen, Check } from "lucide-react";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const SUBJECTS = [
  "English",
  "Biology",
  "Physics",
  "Science",
  "Chemistry",
  "Mathematics",
  "Literature",
  "Government",
  "Civic Education",
];

const GRADES = [
  "Primary 1-3",
  "Primary 4-6",
  "Junior Secondary",
  "Senior Secondary",
  "University",
  "Adult learner",
];

const schema = z.object({
  display_name: z.string().trim().min(2, "Please enter your name").max(80),
  avatar_url: z.string().trim().url("Use a valid image URL").max(500).or(z.literal("")),
});

const ProfileSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.pathname === "/profile";
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [role, setRole] = useState<"student" | "educator">("student");
  const [grade, setGrade] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name ?? "");
          setAvatarUrl(data.avatar_url ?? "");
          setRole((data.role as "student" | "educator") ?? "student");
          setGrade(data.grade_level ?? "");
          setSubjects(data.subjects ?? []);
          setNotifyEmail(data.notify_email ?? true);
          setNotifySms(data.notify_sms ?? false);
        }
        setHydrating(false);
      });
  }, [user, authLoading, navigate]);

  const toggleSubject = (s: string) =>
    setSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const initials = (displayName || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = schema.safeParse({ display_name: displayName, avatar_url: avatarUrl });
    if (!parsed.success) {
      toast({
        title: "Check your details",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    if (!grade) {
      toast({ title: "Please pick a grade level", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: parsed.data.display_name,
        avatar_url: parsed.data.avatar_url || null,
        role,
        grade_level: grade,
        subjects,
        notify_email: notifyEmail,
        notify_sms: notifySms,
        profile_completed: true,
      })
      .eq("user_id", user.id);

    if (!error) {
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: isEditMode ? "Profile updated" : "Profile complete 🎉",
        body: isEditMode ? "Your changes have been saved." : "Your learning experience is now personalized.",
        link: isEditMode ? "/profile" : "/subjects",
      });
    }

    setLoading(false);
    if (error) {
      toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Profile saved!", description: isEditMode ? "Your changes have been saved." : "Let's start learning." });
    navigate(isEditMode ? "/" : "/subjects", { replace: true });
  };

  if (authLoading || hydrating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-2xl py-8 md:py-12">
        {!isEditMode && (
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Skip for now
          </Link>
        )}
        {isEditMode && (
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        )}

        <div className="flex flex-col items-center text-center mb-8">
          <img src={logo} alt="EduRapport" className="h-14 w-auto mb-4" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            {isEditMode ? "Edit your profile" : "Set up your profile"}
          </h1>
          <p className="text-muted-foreground mt-2 font-body">
            {isEditMode ? "Update your learning preferences anytime." : "Help us personalize your learning experience."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card shadow-sm p-6 md:p-8 space-y-8"
        >
          {/* Identity */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold text-lg text-foreground">About you</h2>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                  />
                ) : (
                  <span className="font-heading font-bold text-xl text-primary">
                    {initials}
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="display_name">Display name</Label>
                <Input
                  id="display_name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="h-11"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL (optional)</Label>
              <Input
                id="avatar_url"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="h-11"
              />
            </div>
          </section>

          {/* Role + Grade */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold text-lg text-foreground">
              Your learning context
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  role === "student"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40",
                )}
              >
                <BookOpen className="h-5 w-5 text-primary mb-2" />
                <p className="font-semibold text-sm">Student</p>
                <p className="text-xs text-muted-foreground">I'm here to learn</p>
              </button>
              <button
                type="button"
                onClick={() => setRole("educator")}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  role === "educator"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40",
                )}
              >
                <GraduationCap className="h-5 w-5 text-primary mb-2" />
                <p className="font-semibold text-sm">Educator</p>
                <p className="text-xs text-muted-foreground">I'm here to teach</p>
              </button>
            </div>
            <div className="space-y-2">
              <Label>Grade level</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choose your level" />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Subjects */}
          <section className="space-y-4">
            <div>
              <h2 className="font-heading font-bold text-lg text-foreground">
                Subjects you're interested in
              </h2>
              <p className="text-sm text-muted-foreground">Pick as many as you like.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => {
                const active = subjects.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleSubject(s)}
                    className={cn(
                      "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all",
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-foreground hover:border-primary/40",
                    )}
                  >
                    {active && <Check className="h-3 w-3" />}
                    {s}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Notifications */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold text-lg text-foreground">
              Notification preferences
            </h2>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="font-semibold text-sm text-foreground">Email updates</p>
                <p className="text-xs text-muted-foreground">
                  New lessons, tips, and weekly progress.
                </p>
              </div>
              <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="font-semibold text-sm text-foreground">SMS reminders</p>
                <p className="text-xs text-muted-foreground">
                  Quick nudges to keep your streak going.
                </p>
              </div>
              <Switch checked={notifySms} onCheckedChange={setNotifySms} />
            </div>
          </section>

          <Button
            type="submit"
            className="w-full h-12 gradient-primary text-primary-foreground font-bold text-base rounded-full hover:opacity-90"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditMode ? "Save changes" : "Save and continue"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default ProfileSetup;
