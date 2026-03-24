import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import MobileMenuContext from "./MobileMenuContext";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <MobileMenuContext.Provider value={() => setSidebarOpen(true)}>
      <div className="h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Outlet />
        </div>
      </div>
    </MobileMenuContext.Provider>
  );
}
