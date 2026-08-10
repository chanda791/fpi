import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdown(null);
    // Release the mobile-menu scroll lock immediately on navigation, in the
    // same effect as the route change itself -- not a render cycle later
    // via the isOpen-dependent effect below. Otherwise ScrollToTop's
    // scrollTo(0,0) can fire while the body is still overflow:hidden (most
    // mobile browsers just ignore a scroll call in that state), and nothing
    // re-applies it once the lock actually releases -- the page is left
    // wherever the browser's scroll/layout heuristics land, which is often
    // near the bottom after scrolling through a long mobile menu.
    document.body.style.overflow = "auto";
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const navItems = {
    mil: {
      title: "MIL",
      icon: "🎓",
items: [
  {
    name: "About MIL",
    path: "/mil/about",
    description: "Understanding Media & Information Literacy",
  },
  {
    name: "MIL Hubs",
    path: "/mil/hubs",
    description: "Community learning hubs",
  },
  {
    name: "Radio Spots",
    path: "/mil/radio-spots",
    description: "Educational radio programmes",
  },
  {
    name: "Brochure",
    path: "/mil/brochure",
    description: "Download the official MIL brochure",
  },
],
    },
    programs: {
      title: "Projects & Activities",
      icon: "📚",
      items: [
        { name: "Advocacy", path: "/programs/advocacy", description: "Media freedom" },
        { name: "Media Literacy", path: "/programs/media-literacy", description: "Education" },
        { name: "Research", path: "/programs/research", description: "Insights" },
        { name: "Capacity Building", path: "/programs/capacity-building", description: "Training" },
        {
          name: "SheRise",
          path: "/projects/sherise",
          description: "Empowering women and girls",
        },
        {
          name: "Claim Your Space",
          path: "/projects/claim-your-space",
          description: "Promoting civic participation",
        },
        {
          name: "Funsani",
          path: "/projects/funsani",
          description: "Community empowerment initiative",
        },
        {
          name: "Enhancing Conflict Sensitive Journalism",
          path: "/projects/conflict-sensitive-journalism",
          description: "Responsible and ethical reporting",
        },
      ],
    },
        knowledge: {
        title: "Knowledge",
        icon: "📖",
        items: [
            {
            name: "Resources Hub",
            path: "/resources",
            description: "Knowledge centre",
            },
            {
            name: "Reports",
            path: "/knowledge/reports",
            description: "Research publications",
            },
            {
            name: "Newsletters",
            path: "/knowledge/newsletters",
            description: "Latest updates",
            },
            {
            name: "Publications",
            path: "/knowledge/publications",
            description: "Guides and toolkits",
            },
            {
            name: "Press Statements",
            path: "/knowledge/press-statements",
            description: "Official statements",
            }
        ],
        },
    about: {
      title: "About FPI",
      icon: "🏢",
      items: [
        { name: "About Us", path: "/about", description: "Learn about our mission" },
        { name: "Our Team", path: "/team", description: "Meet our team" },
        { name: "Donors", path: "/donors", description: "Our Donors" },
        { name: "Partners", path: "/partners", description: "Collaborations" },
      ],
    },
  };

  const isActive = (path: string) => location.pathname === path;

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  };

  return (
    <>
      {/* LIGHT GRADIENT NAVBAR - white on left for logo */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-gradient-to-r from-white via-white/95 to-orange-50/90 backdrop-blur-md border-b border-orange-100 shadow-sm py-2"
            : "bg-gradient-to-r from-white via-white/90 to-orange-50/80 backdrop-blur-sm border-b border-orange-100 py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex justify-between items-center">
          {/* ORIGINAL IMAGE LOGO - restored */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="FPI Zambia Logo"
              className="h-14 w-auto object-contain drop-shadow-sm"
            />
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-gray-800">FPI Zambia</h1>
              <p className="text-xs text-gray-500">Free Press Initiative Zambia</p>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center space-x-4">
            {Object.entries(navItems).map(([key, section]) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => setDropdown(key)}
                onMouseLeave={() => setDropdown(null)}
              >
                <button className="flex items-center space-x-1 px-4 py-2 rounded-xl text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300">
                  <span>{section.icon}</span>
                  <span>{section.title}</span>
                  <ChevronDown size={14} />
                </button>

                <AnimatePresence>
                  {dropdown === key && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 mt-2 w-72 bg-white/90 backdrop-blur-xl border border-orange-100 rounded-2xl shadow-xl p-3"
                    >
                      {section.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`block px-3 py-2 rounded-xl hover:bg-orange-50 transition ${
                            isActive(item.path) ? "text-orange-600 font-semibold" : "text-gray-700"
                          }`}
                        >
                          <div>{item.name}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <Link
              to="/contact"
              className={`px-4 py-2 rounded-xl transition-all text-gray-700 ${
                location.pathname === "/contact"
                  ? "bg-orange-600 text-white"
                  : "hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              Contact
            </Link>

            <button onClick={() => setSearchOpen(true)} className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 p-2 rounded-full transition">
              <Search size={20} />
            </button>
          </div>

          {/* MOBILE BUTTON */}
          <button className="lg:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 pt-24 px-6 overflow-y-auto bg-white/90 backdrop-blur-xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.2 }}
          >
            {Object.entries(navItems).map(([key, section]) => (
              <div key={key} className="mb-6">
                <h3 className="font-bold text-xl mb-2 text-orange-600">{section.title}</h3>
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-gray-700 hover:text-orange-600 transition"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ))}
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-orange-600 transition">
              Contact
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-xl border border-orange-100 rounded-2xl shadow-2xl w-full max-w-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                className="w-full border border-gray-200 bg-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 placeholder-gray-400"
                placeholder="Search articles, projects, events..."
                autoFocus
              />
              <div className="flex justify-end mt-4">
                <button onClick={() => setSearchOpen(false)} className="px-4 py-2 text-gray-600 hover:text-orange-600 transition">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;