/**
 * Sidebar Component (Chat App - Backend Connected)
 */

import React from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  MessageSquare,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  chatHistory = [],
  activeChat,
  setActiveChat,
  onNewChat,
  isCreating,
  onOpenSearch,
  onOpenSettings,
  onLogout,
}) => {
  return (
    <>
      {/* ----- Mobile Hamburger ----- */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 bg-white/10 p-3 rounded-lg border border-white/10 text-white backdrop-blur-lg hover:bg-white/20 transition"
        >
          <PanelLeftOpen size={22} />
        </button>
      )}

      {/* ----- Mobile Backdrop ----- */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
        ></div>
      )}

      {/* ----- Sidebar Panel ----- */}
      <aside
        className={`
          fixed md:static left-0 top-0 h-screen z-40 overflow-hidden
          bg-[#0d0d0f]/80 backdrop-blur-xl border-r border-gray-800
          transition-all duration-300 flex flex-col
          ${isSidebarOpen ? "w-64" : "w-0 md:w-20"}
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {isSidebarOpen && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 p-4">
              <span className="text-lg font-semibold text-white tracking-wide hidden md:block">
                NupatAI
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-white transition md:hidden"
              >
                <PanelLeftClose size={22} />
              </button>
            </div>

            {/* Main Buttons */}
            <div className="p-4 flex flex-col gap-3">
              <button
                onClick={onNewChat}
                disabled={isCreating}
                className="flex items-center gap-3 p-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/20 text-white transition disabled:opacity-50"
              >
                <Plus size={19} />
                <span>New Chat</span>
              </button>

              <button
                onClick={onOpenSearch}
                className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
              >
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 px-3 overflow-y-auto custom-scroll space-y-1">
              <div className="text-xs text-gray-500 px-1 mb-2">History</div>

              {chatHistory.length === 0 ? (
                <div className="text-gray-500 text-sm px-2">No history yet</div>
              ) : (
                chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChat({ ...chat, messages: [] })}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-lg text-sm transition
                      ${activeChat?.id === chat.id
                        ? "bg-blue-600/50 text-white"
                        : "text-gray-300 hover:bg-gray-800/50 hover:text-white"}
                    `}
                  >
                    <MessageSquare size={18} />
                    <span className="truncate">{chat.title}</span>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800 flex flex-col gap-3">
              <button
                onClick={onOpenSettings}
                className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <Link to="">
                <button
                  onClick={onLogout}
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
