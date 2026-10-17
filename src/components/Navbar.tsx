import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, LogOut, User, Settings, Flame, Coins } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useRewards } from "@/hooks/use-rewards";
import logo from "@/assets/logo.png";
import NotificationBell from "@/components/NotificationBell";
import { useAuth } from "@/hooks/use-auth";
import { lessonsData } from "@/data/lessons";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
{ label: "Subjects", to: "/subjects" },
{ label: "Rewards", to: "/rewards" },
{ label: "About us", to: "/about" },
{ label: "Contact us", href: "#contact" }];

const searchableSubjects = [
  "English",
  "Biology",
  "Physics",
  "Science",
  "Chemistry",
  "Mathematics",
  "Literature",
  "Government",
  "Social & Emotional Learning",
  "Civic Education",
];

type SearchResult = { label: string; detail: string; to: string; kind: "Subject" | "Lesson" };

const SearchBox = ({ onNavigate }: { onNavigate?: () => void }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const results = useMemo<SearchResult[]>(() => {
    if (!normalizedQuery) return [];

    const subjects = searchableSubjects
      .filter((subject) => subject.toLocaleLowerCase().includes(normalizedQuery))
      .map((subject) => ({
        label: subject,
        detail: "Browse subject lessons",
        to: `/subjects/${encodeURIComponent(subject)}`,
        kind: "Subject" as const,
      }));

    const lessons = lessonsData
      .filter((lesson) =>
        `${lesson.title} ${lesson.subject} ${lesson.artist}`.toLocaleLowerCase().includes(normalizedQuery),
      )
      .map((lesson) => ({
        label: lesson.title,
        detail: `${lesson.subject} · ${lesson.artist}`,
        to: `/lessons/${lesson.id}`,
        kind: "Lesson" as const,
      }));

    return [...subjects, ...lessons].slice(0, 8);
  }, [normalizedQuery]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const openFirstResult = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!results.length) return;
    navigate(results[0].to);
    setQuery("");
    setIsOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={containerRef} className="relative w-full md:w-40 md:focus-within:w-56 transition-[width]">
      <form onSubmit={openFirstResult} role="search">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
          placeholder="Search subjects & lessons"
          aria-label="Search subjects and lessons"
          aria-expanded={isOpen && normalizedQuery.length > 0}
          aria-controls="site-search-results"
          autoComplete="off"
          className="h-10 w-full rounded-full border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </form>
      {isOpen && normalizedQuery && (
        <div
          id="site-search-results"
          role="region"
          aria-label="Search results"
          className="absolute left-0 right-0 top-full z-[60] mt-2 max-h-80 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg md:w-80"
        >
          {results.length ? results.map((result) => (
            <Link
              key={`${result.kind}-${result.to}`}
              to={result.to}
              onClick={() => {
                setQuery("");
                setIsOpen(false);
                onNavigate?.();
              }}
              className="flex min-w-0 items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">{result.label}</span>
                <span className="block truncate text-xs text-muted-foreground">{result.detail}</span>
              </span>
              <span className="shrink-0 text-[10px] font-bold uppercase text-primary">{result.kind}</span>
            </Link>
          )) : (
            <p className="px-3 py-4 text-sm text-muted-foreground">No subjects or lessons found.</p>
          )}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ display_name?: string | null; avatar_url?: string | null } | null>(null);
  const { state: rewards } = useRewards();

  useEffect(() => {
    if (!user) { setProfile(null); return; }
    supabase.from("profiles").select("display_name, avatar_url").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  const initials = (profile?.display_name || user?.email || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="EduRapport" className="h-14 w-auto border-none shadow-xl object-contain rounded-none" />
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) =>
            l.to ? (
              <Link
                key={l.label}
                to={l.to}
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                {l.label}
              </a>
            )
          )}
          <SearchBox />
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <NotificationBell />
              <RouterLink
                to="/rewards"
                className="flex items-center gap-2 text-xs font-bold text-foreground hover:text-primary px-2.5 py-1.5 rounded-full border border-border bg-background transition-colors"
                title="View rewards"
              >
                <span className="inline-flex items-center gap-1" aria-label={`${rewards.streak} day streak`}>
                  <Flame className="h-3.5 w-3.5 text-primary" aria-hidden />
                  {rewards.streak}
                </span>
                <span className="inline-flex items-center gap-1" aria-label={`${rewards.coins} coins`}>
                  <Coins className="h-3.5 w-3.5 text-primary" aria-hidden />
                  {rewards.coins}
                </span>
              </RouterLink>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative flex items-center gap-2 outline-none">
                    <Avatar className="h-9 w-9 border border-border">
                      {profile?.avatar_url ? (
                        <AvatarImage src={profile.avatar_url} alt={profile?.display_name || ""} />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{profile?.display_name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Edit profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
                Login
              </Link>
              <Link
                to="/signup"
                className="gradient-primary text-primary-foreground text-sm font-bold px-5 py-2 rounded-full hover:opacity-90 transition-opacity">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile bell */}
        {user && (
          <div className="md:hidden flex items-center gap-2">
            <NotificationBell />
          </div>
        )}

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-t border-border px-6 pb-4 space-y-3">
          {navLinks.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} className="block text-sm font-semibold text-foreground py-2" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} className="block text-sm font-semibold text-foreground py-2" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            )
          )}
          <div className="py-2">
            <SearchBox onNavigate={() => setOpen(false)} />
          </div>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-foreground py-2">
                <User className="h-4 w-4" />
                Edit profile
              </Link>
              <button onClick={() => { setOpen(false); handleLogout(); }} className="flex items-center gap-2 text-sm font-semibold text-destructive py-2">
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-semibold text-primary">Login</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="gradient-primary text-primary-foreground text-sm font-bold px-5 py-2 rounded-full">Sign up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;