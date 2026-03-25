import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Users, BarChart3, FileText, Settings, Layout, Shield } from "lucide-react";
import { cn } from "./ui/utils";
import { adminCheckSession } from "../utils/githubApi";

interface MenuItem {
  id: string;
  name: string;
  icon: React.ElementType;
  path: string;
  adminOnly?: boolean;
}

interface SidebarProps {
  onClose?: () => void;
}

const SESSION_KEY = "solomon-admin-session";

const menuItems: MenuItem[] = [
  {
    id: "situation-room",
    name: "상황실",
    icon: Layout,
    path: "/",
  },
  {
    id: "staff-management",
    name: "Agent 관리",
    icon: Users,
    path: "/customize",
  },
  {
    id: "operation-log",
    name: "작전 기록",
    icon: FileText,
    path: "/logs",
  },
  {
    id: "statistics",
    name: "통계",
    icon: BarChart3,
    path: "/stats",
    adminOnly: true,
  },
  {
    id: "settings",
    name: "설정",
    icon: Settings,
    path: "/settings",
  },
  {
    id: "admin",
    name: "관리자",
    icon: Shield,
    path: "/admin",
    adminOnly: true,
  },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const sid = sessionStorage.getItem(SESSION_KEY);
    if (sid) {
      adminCheckSession(sid).then(setIsAdmin);
    } else {
      setIsAdmin(false);
    }
  }, [location.pathname]);

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const visibleItems = menuItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Solomon</h1>
            <p className="text-xs text-slate-400">AI Agent 시스템</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">시스템 상태</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0" />
            <span className="text-sm text-white font-medium">정상 운영중</span>
          </div>
        </div>
      </div>
    </div>
  );
}
