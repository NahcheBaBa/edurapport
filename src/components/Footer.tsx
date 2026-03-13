import logo from "@/assets/logo.png";

const Footer = () =>
<footer className="bg-foreground text-primary-foreground py-12">
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img alt="EduRapport" className="h-8 w-8 object-contain" src="/lovable-uploads/2971320b-51b5-4be3-b524-4d9707edc907.png" />
            
          </div>
          <p className="text-xs opacity-70 leading-relaxed">
            Your rapport buddy through effective learning.
          </p>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-heading font-bold text-sm mb-3">Company</h4>
          <ul className="space-y-2 text-xs opacity-70">
            <li><a href="#" className="hover:opacity-100 transition-opacity">About</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Team</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Partners</a></li>
          </ul>
        </div>

        {/* Work with us */}
        <div>
          <h4 className="font-heading font-bold text-sm mb-3">Work with us</h4>
          <ul className="space-y-2 text-xs opacity-70">
            <li><a href="#" className="hover:opacity-100 transition-opacity">Become a Manager</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Peer Researcher</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Resource Sponsors</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-heading font-bold text-sm mb-3">Subscribe to our Newsletter</h4>
          <div className="flex gap-2">
            <input
            type="email"
            placeholder="Your email address"
            className="flex-1 text-xs px-3 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary" />
          
            <button className="gradient-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 pt-6 text-center">
        <p className="text-xs opacity-50">© {new Date().getFullYear()} EduRapport. All rights reserved.</p>
      </div>
    </div>
  </footer>;


export default Footer;