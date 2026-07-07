import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, LogOut, User, Settings, Mic } from "lucide-react";
import logo from "@/assets/logo.png";
import NotificationBell from "@/components/NotificationBell";
import { useAuth } from "@/hooks/use-auth";
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


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ display_name?: string | null; avatar_url?: string | null } | null>(null);

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
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-40 rounded-full border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:w-56 transition-all"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <NotificationBell />
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
                    <span className="flex items-center gap-1 text-sm font-bold text-foreground" title="Streak">
                      0
                      <Mic className="h-4 w-4 text-primary" />
                    </span>
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
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
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