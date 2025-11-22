/**
    * @description      : 
    * @author           : fortu
    * @group            : 
    * @created          : 22/11/2025 - 16:35:36
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/11/2025
    * - Author          : fortu
    * - Modification    : 
**/
import React from "react";
import {
  Plus,
  Search,
  MessageSquare,
  Settings,
  LogOut,

  X,
  Menu,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  chatHistory = [],
  onNewChat,
  onOpenSearch,
  onSelectHistory,
  onOpenSettings,
  onLogout,
}) => {
  return (
    <>
      {/* MOBILE HAMBURGER BUTTON — ONLY WHEN CLOSED */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 bg-white/10 p-3 rounded-lg border border-white/10 text-white backdrop-blur-lg hover:bg-white/20 transition"
        >
          <PanelLeftOpen size={22} />
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
                <PanelLeftClose size={22} />
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
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-400 transition hover:text-white"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </button>
      </aside>

      {/* Actions */}
      <div className="flex flex-col gap-3 p-4">
        <button
          onClick={onNewChat}
          className={`flex items-center gap-3 p-3 rounded-lg text-white bg-blue-600/20 
            hover:bg-blue-600/30 border border-blue-600/20 transition ${!isSidebarOpen && "justify-center"}`}
        >
          <Plus size={20} />
          {isSidebarOpen && "New Chat"}
        </button>

        <button
          onClick={onOpenSearch}
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 
            transition ${!isSidebarOpen && "justify-center"}`}
        >
          <Search size={20} />
          {isSidebarOpen && "Search"}
        </button>
      </div>

      {/* History */}
      <div className="custom-scroll flex-1 overflow-y-auto px-3 py-2">
        <div className="px-1 text-xs text-gray-400 mb-2">{isSidebarOpen ? "History" : ""}</div>
        <div className="space-y-2">
          {chatHistory.length === 0 && (
            <div className="text-gray-500 text-sm px-2">No history yet</div>
          )}

          {chatHistory.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className={`w-full text-left p-3 rounded-lg text-gray-300 hover:bg-gray-800/50 transition text-sm
                ${!isSidebarOpen && "text-center"}`}
              title={item.summary}
            >
              {isSidebarOpen ? (
                <div className="flex items-center justify-between">
                  <div className="truncate max-w-[14rem]">{item.summary}</div>
                  <div className="text-xs text-gray-500 ml-3">{new Date(item.ts).toLocaleDateString()}</div>
                </div>
              ) : (
                <MessageSquare />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-gray-800 p-4">
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 
            transition ${!isSidebarOpen && "justify-center"}`}
        >
          <Settings size={20} />
          {isSidebarOpen && "Settings"}
        </button>

        <button
          onClick={onLogout}
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-red-700/10 hover:text-red-400 transition 
            ${!isSidebarOpen && "justify-center"}`}
        >
          <LogOut size={20} />
          {isSidebarOpen && "Logout"}
        </button>
      </div>
    </>
  );
};

export default Sidebar;
