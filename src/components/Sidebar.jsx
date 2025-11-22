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
  PanelLeftClose,
  PanelLeftOpen,
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
    <aside
      className={`h-screen bg-black/40 backdrop-blur-xl border-r border-gray-800 
      transition-all duration-300 flex flex-col ${isSidebarOpen ? "w-64" : "w-20"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 p-4">
        {isSidebarOpen && (
          <span className="text-xl font-bold tracking-wide text-white">NonaAI</span>
        )}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-400 transition hover:text-white"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </button>
      </div>

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
    </aside>
  );
};

export default Sidebar;
