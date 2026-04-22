import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  MessageCircle,
  ChevronDown,
  Megaphone,
  Calendar,
  Music,
  LogOut,
  BookOpen,
} from "lucide-react";

interface NavItem {
  label?: string;
  href?: string;
  icon?: any;
  divider?: boolean;
  items?: Array<{
    label: string;
    href: string;
    badge?: number | React.ReactNode;
  }>;
  badge?: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Announcements",
    href: "/announcements",
    icon: Megaphone,
  },
  { divider: true },
  {
    label: "Team Members",
    href: "/teammembers",
    icon: MessageCircle,
  },
  {
    label: "Schedule",
    href: "/schedule",
    icon: Calendar,
  },
  {
    label: "Song Library",
    href: "/library",
    icon: Music,
  },
  {
    label: "Scripture Wall",
    href: "/scripture-wall",
    icon: BookOpen,
  },
];

export function Sidebar() {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["Folders"]);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleFolder = (label: string) => {
    setExpandedFolders((prev) =>
      prev.includes(label)
        ? prev.filter((f) => f !== label)
        : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">App</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item, idx) => {
          if (item.divider) {
            return (
              <div key={`divider-${idx}`} className="my-4 border-t border-gray-200" />
            );
          }

          if (!item.label || !item.href) return null;

          const hasSubItems = item.items && item.items.length > 0;
          const isExpanded = expandedFolders.includes(item.label);
          const itemIsActive = isActive(item.href);

          if (hasSubItems) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleFolder(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    itemIsActive || isExpanded
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon size={18} />}
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            );
          }

          return (
            <div key={item.label}>
              <Link
                to={item.href}
                className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  itemIsActive
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon && <item.icon size={18} />}
                  <span>{item.label}</span>
                </div>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
