import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const navLinks = [
{ label: "Subjects", href: "#projects" },
{ label: "About us", href: "#about" },
{ label: "Resources", href: "#resources" },
{ label: "Contact us", href: "#contact" }];


const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2">
          <img src={logo} alt="EduRapport" className="h-14 w-auto border-none shadow-xl object-contain rounded-none" />
          

          
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) =>
          <a
            key={l.label}
            href={l.href}
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
            
              {l.label}
            </a>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="#login" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
            Login
          </a>
          <a
            href="#signup"
            className="gradient-primary text-primary-foreground text-sm font-bold px-5 py-2 rounded-full hover:opacity-90 transition-opacity">
            
            Sign up
          </a>
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
        <a key={l.label} href={l.href} className="block text-sm font-semibold text-foreground py-2" onClick={() => setOpen(false)}>
              {l.label}
            </a>
        )}
          <div className="flex gap-3 pt-2">
            <a href="#login" className="text-sm font-semibold text-primary">Login</a>
            <a href="#signup" className="gradient-primary text-primary-foreground text-sm font-bold px-5 py-2 rounded-full">Sign up</a>
          </div>
        </div>
      }
    </nav>);

};

export default Navbar;