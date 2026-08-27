import { Gamepad2, Mail } from 'lucide-react'

const FOOTER_LINKS = {
  Product: [
    { label: "Games", href: "/home" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Leaderboards", href: "/leaderboards" },
  ],
  // Community: [
  //   { label: "Friends", href: "/friends" },
  //   { label: "Reviews", href: "/reviews" },
  //   { label: "Discord", href: "#" },
  // ],
  Resources: [
    { label: "About Us", href: "/about-us" },
    { label: "GitHub Repo", href: "https://github.com/yourname/playverse" },
    { label: "Contribute", href: "https://github.com/yourname/playverse/blob/main/CONTRIBUTING.md" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
}

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

function Footer() {
  return (
    <footer className="pt-10 text-white" style={TILE_BG}>
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Logo + tagline column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Gamepad2 className="text-red-500 size-7" />
              <span className="text-xl text-green-400 font-bold">
                Play<span className="text-red-500">Verse</span>
              </span>
            </div>
            <p className="text-sm text-white/40 max-w-xs">
              A digital playground of grid-based games. No installs, no ads, just play.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-3 ml-auto">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide">{heading}</h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/50 hover:text-green-400 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-white/10">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} PlayVerse. Built for fun, open for contributions.
          </p>

          <div className="flex items-center gap-4">
            <a href="https://github.com/yourname/playverse" target="_blank" rel="noopener noreferrer"
              className="text-white/40 hover:text-green-400 transition-colors">
              
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer"
              className="text-white/40 hover:text-green-400 transition-colors">
             
            </a>
            <a href="mailto:hello@playverse.dev"
              className="text-white/40 hover:text-green-400 transition-colors">
              
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer