import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  House,
  Calendar,
  FolderKanban,
  FileText,
  Newspaper,
  Users,
  MapPinned,
  Map,
  Image,
  Settings,
  BookOpen,
  Mic,
  ShieldCheck,
  Handshake,
  Heart,
  FolderOpen,
  FileStack,
  MessageSquare,
  Send,
  Inbox,
  LayoutTemplate,
} from "lucide-react";

const Sidebar = () => {
  const { pathname } = useLocation();

  const itemClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      pathname === path
        ? "bg-red-600 text-white"
        : "text-slate-200 hover:bg-slate-800"
    }`;

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-white min-h-screen overflow-y-auto">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">FPI CMS</h1>
        <p className="text-xs text-slate-400 mt-1">
          Content Management System
        </p>
      </div>

      <nav className="p-4 space-y-1">

        <Link to="/admin" className={itemClass("/admin")}>
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link to="/admin/homepage" className={itemClass("/admin/homepage")}>
          <House size={20} />
          Homepage
        </Link>

        <div className="pt-5 pb-2 text-xs uppercase tracking-wider text-slate-500">
          Content
        </div>

        <Link to="/admin/activities" className={itemClass("/admin/activities")}>
          <Calendar size={20} />
          Activities
        </Link>

        <Link to="/admin/projects" className={itemClass("/admin/projects")}>
          <FolderKanban size={20} />
          Projects
        </Link>

        <Link to="/admin/reports" className={itemClass("/admin/reports")}>
          <FileText size={20} />
          Reports
        </Link>

        <Link to="/admin/publications" className={itemClass("/admin/publications")}>
          <BookOpen size={20} />
          Publications
        </Link>

        <Link to="/admin/newsletters" className={itemClass("/admin/newsletters")}>
          <Newspaper size={20} />
          Newsletters
        </Link>

        <Link
          to="/admin/press-statements"
          className={itemClass("/admin/press-statements")}
        >
          <FileText size={20} />
          Press Statements
        </Link>

        <Link to="/admin/radio-spots" className={itemClass("/admin/radio-spots")}>
          <Mic size={20} />
          Radio Spots
        </Link>

        <div className="pt-5 pb-2 text-xs uppercase tracking-wider text-slate-500">
          Partnerships & Resources
        </div>

        <Link to="/admin/partners" className={itemClass("/admin/partners")}>
          <Handshake size={20} />
          Partners
        </Link>

        <Link to="/admin/donors" className={itemClass("/admin/donors")}>
          <Heart size={20} />
          Donors
        </Link>

        <Link to="/admin/resources" className={itemClass("/admin/resources")}>
          <FolderOpen size={20} />
          Resources
        </Link>

        <Link to="/admin/brochures" className={itemClass("/admin/brochures")}>
          <FileStack size={20} />
          Brochures
        </Link>

        <div className="pt-5 pb-2 text-xs uppercase tracking-wider text-slate-500">
          Engagement
        </div>

        <Link to="/admin/testimonials" className={itemClass("/admin/testimonials")}>
          <MessageSquare size={20} />
          Comments
        </Link>

        <Link to="/admin/subscribers" className={itemClass("/admin/subscribers")}>
          <Send size={20} />
          Subscribers
        </Link>

        <Link to="/admin/messages" className={itemClass("/admin/messages")}>
          <Inbox size={20} />
          Messages
        </Link>

        <Link to="/admin/program-pages" className={itemClass("/admin/program-pages")}>
          <LayoutTemplate size={20} />
          Program Pages
        </Link>

        <div className="pt-5 pb-2 text-xs uppercase tracking-wider text-slate-500">
          Media & Hubs
        </div>

        <Link to="/admin/hubs" className={itemClass("/admin/hubs")}>
          <MapPinned size={20} />
          MIL Hubs
        </Link>

        <Link to="/admin/provinces" className={itemClass("/admin/provinces")}>
          <Map size={20} />
          Provinces
        </Link>

        <Link to="/admin/media" className={itemClass("/admin/media")}>
          <Image size={20} />
          Media Library
        </Link>

        <div className="pt-5 pb-2 text-xs uppercase tracking-wider text-slate-500">
          Administration
        </div>

        <Link to="/admin/team" className={itemClass("/admin/team")}>
          <Users size={20} />
          Team Members
        </Link>

        <Link to="/admin/users" className={itemClass("/admin/users")}>
          <ShieldCheck size={20} />
          Users
        </Link>

        <Link to="/admin/settings" className={itemClass("/admin/settings")}>
          <Settings size={20} />
          Settings
        </Link>

      </nav>
    </aside>
  );
};

export default Sidebar;