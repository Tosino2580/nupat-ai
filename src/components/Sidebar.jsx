/**
 * Sidebar Component
 */

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
  PanelLeftClose,
  PanelLeftOpen
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
    <aside
      className={`h-screen bg-black/40 backdrop-blur-xl border-r border-gray-800 
      transition-all duration-300 flex flex-col 
      ${isSidebarOpen ? "w-64" : "w-20"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 p-4">
        {isSidebarOpen && (
          <span className="text-xl font-bold tracking-wide text-white">
            NupatAI
          </span>
        )}

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-400 transition hover:text-white"
        >
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </button>
      </div>

      {/* Main Buttons */}
      <div className="flex flex-col gap-3 p-4">

        {/* New Chat */}
        <button
          onClick={handleNewChat}
          className={`flex items-center gap-3 p-3 rounded-lg text-white bg-blue-600/20 
          hover:bg-blue-600/30 border border-blue-600/20 transition 
          ${!isSidebarOpen && "justify-center"}`}
        >
          <Plus size={20} />
          {isSidebarOpen && "New Chat"}
        </button>

        {/* Search */}
        <button
          onClick={() => navigate("/search")}
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 
          transition ${!isSidebarOpen && "justify-center"}`}
        >
          <Search size={20} />
          {isSidebarOpen && "Search Chats"}
        </button>

        {/* Library */}
        <button
          onClick={() => navigate("/library")}
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 
          transition ${!isSidebarOpen && "justify-center"}`}
        >
          <Archive size={20} />
          {isSidebarOpen && "Library"}
        </button>

        {/* Projects */}
        <button
          onClick={() => navigate("/projects")}
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 
          transition ${!isSidebarOpen && "justify-center"}`}
        >
          <FolderKanban size={20} />
          {isSidebarOpen && "Projects"}
        </button>
      </div>

      {/* Chat History */}
      <div className="custom-scroll flex-1 space-y-2 overflow-y-auto px-4 py-2">
        {chatHistory.map((chat, i) => (
          <button
            key={i}
            onClick={() => navigate(`/chat/${i}`)}
            className={`w-full text-left p-3 rounded-lg text-gray-400 hover:bg-gray-800/50 
            transition text-sm ${!isSidebarOpen && "text-center"}`}
          >
            {isSidebarOpen ? chat : <MessageSquare />}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-gray-800 p-4">

        <button
          onClick={() => navigate("/settings")}
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 
          transition ${!isSidebarOpen && "justify-center"}`}
        >
          <Settings size={20} />
          {isSidebarOpen && "Settings"}
        </button>

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 
          transition ${!isSidebarOpen && "justify-center"}`}
        >
          <LogOut size={20} />
          {isSidebarOpen && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
