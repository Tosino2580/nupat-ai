import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  Search,
  Archive,
  FolderKanban,
  Settings,
  LogOut,
  MessageSquare,
  X,
  Menu,
} from "lucide-react";

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  chatHistory,
  handleNewChat,
  handleLogout,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* MOBILE HAMBURGER BUTTON — ONLY WHEN CLOSED */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 bg-white/10 p-3 rounded-lg border border-white/10 text-white backdrop-blur-lg hover:bg-white/20 transition"
        >
          <Menu size={22} />
        </button>
      )}

      {/* BACKDROP (MOBILE ONLY) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static left-0 top-0 h-screen z-40 overflow-hidden
          bg-[#0d0d0f]/80 backdrop-blur-xl border-r border-gray-800
          transition-all duration-300 flex flex-col
          ${isSidebarOpen ? "w-64" : "w-0 md:w-64"}
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Only render everything INSIDE if sidebar is open */}
        {isSidebarOpen && (
          <>
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-gray-800 p-4">
              <span className="text-lg font-semibold text-white tracking-wide hidden md:block">
                NupatAI
              </span>

              {/* Close Button Mobile */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-white transition md:hidden"
              >
                <X size={22} />
              </button>
            </div>

            {/* MAIN ACTION BUTTONS */}
            <div className="p-3 flex flex-col gap-2">
              <button
                onClick={handleNewChat}
                className="group flex items-center gap-3 w-full rounded-lg p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white transition"
              >
                <Plus size={19} />
                <span>New Chat</span>
              </button>

              <button
                onClick={() => navigate("/search")}
                className="group flex items-center gap-3 w-full rounded-lg p-3 text-gray-300 hover:bg-white/5 transition"
              >
                <Search size={18} />
                <span>Search</span>
              </button>

              <button
                onClick={() => navigate("/library")}
                className="group flex items-center gap-3 w-full rounded-lg p-3 text-gray-300 hover:bg-white/5 transition"
              >
                <Archive size={18} />
                <span>Library</span>
              </button>

              <button
                onClick={() => navigate("/projects")}
                className="group flex items-center gap-3 w-full rounded-lg p-3 text-gray-300 hover:bg-white/5 transition"
              >
                <FolderKanban size={18} />
                <span>Projects</span>
              </button>
            </div>

            {/* CHAT HISTORY */}
            <div className="px-3 flex-1 overflow-y-auto custom-scroll space-y-1">
              {chatHistory.map((chat, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/chat/${i}`)}
                  className="group flex items-center gap-3 w-full rounded-lg p-3 text-gray-400 hover:text-white hover:bg-white/5 transition text-sm"
                >
                  <MessageSquare size={18} />
                  <span className="truncate w-full">{chat}</span>
                </button>
              ))}
            </div>

            {/* FOOTER */}
            <div className="p-3 border-t border-gray-800 flex flex-col gap-2">
              <button
                onClick={() => navigate("/settings")}
                className="group flex items-center gap-3 w-full rounded-lg p-3 text-gray-300 hover:bg-white/5 transition"
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>

              <button
                onClick={handleLogout}
                className="group flex items-center gap-3 w-full rounded-lg p-3 text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition"
              >
                <LogOut size={18} className="text-red-400" />
                <span>Logout</span>
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
