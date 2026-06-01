import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import logo from "@/assets/logo.png";

const navLinks = [
{ label: "Subjects", to: "/subjects" },
{ label: "About us", href: "#about" },
{ label: "Contact us", href: "#contact" }];


const Navbar = () => {
  const [open, setOpen] = useState(false);

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
          <Link to="/login" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
            Login
          </a>
          <Link
            to="/signup"
            className="gradient-primary text-primary-foreground text-sm font-bold px-5 py-2 rounded-full hover:opacity-90 transition-opacity">
            Sign up
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open &&
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
          <div className="flex gap-3 pt-2">
            <a href="#login" className="text-sm font-semibold text-primary">Login</a>
            <Link to="/signup" onClick={() => setOpen(false)} className="gradient-primary text-primary-foreground text-sm font-bold px-5 py-2 rounded-full">Sign up</Link>
          </div>
        </div>
      }
    </nav>);

};

export default Navbar;