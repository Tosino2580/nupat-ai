/**
 * MainPage (Chat-style only, cleaned + optimized)
 */

import React, { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import Sidebar from "./Sidebar";
import SearchModal from "./SearchModal";
import SettingsModal from "./SettingsModal";
import {
  getUserChats,
  getMessages,
  createChat,
  sendMessage,
} from "../api/nupatAPI";

const STORAGE_KEY = "nonaai_chat_history_v1";

const MainPage = () => {
  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // hidden on first load
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Chat state
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [activeChat, setActiveChat] = useState(null); // { id, title, messages: [] }
  const [messageInput, setMessageInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Refs
  const messagesRef = useRef(null);

  // Helpers
  const persistHistory = (next) => {
    setChatHistory(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn("Failed to save history", e);
    }
  };

  const getToken = () => localStorage.getItem("token") || localStorage.getItem("userToken");

  // eslint-disable-next-line no-unused-vars
  const summarize = (text) => {
    if (!text) return "New conversation";
    const trimmed = text.trim().replace(/\s+/g, " ");
    if (trimmed.length <= 60) return trimmed;
    return trimmed.slice(0, 60).trim() + "…";
  };

  // Auto-scroll to bottom when activeChat messages change
  useEffect(() => {
    if (!messagesRef.current) return;
    // small timeout to ensure DOM rendered
    const t = setTimeout(() => {
      try {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      } catch { /* empty */ }
    }, 50);
    return () => clearTimeout(t);
  }, [activeChat?.messages?.length]);

  // Load chats on mount
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    (async () => {
      try {
        const chats = await getUserChats(token);
        const list = Array.isArray(chats) ? chats : chats?.data || [];
        setChatHistory(list || []);
        persistHistory(list || []);

        if (list && list.length > 0) {
          const first = { ...list[0], messages: [] };
          setActiveChat(first);
          await loadMessagesForChat(first.id, token);
        }
      } catch (err) {
        console.error("Failed to load chats:", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load messages helper
  const loadMessagesForChat = async (chatId, tokenArg) => {
    const token = tokenArg || getToken();
    if (!token || !chatId) return;
    try {
      const res = await getMessages(token, chatId);
      const messages = Array.isArray(res?.messages) ? res.messages : [];
      setActiveChat((prev) => ({
        ...(prev || {}),
        id: chatId,
        messages,
      }));
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

const handleNewChat = async () => {
  const token = getToken();
  if (!token) {
    console.warn("No token found for new chat");
    return;
  }

  setIsGenerating(true);
  try {
    // 1️⃣ Save current active chat to history if it exists
    if (activeChat) {
      const existingIndex = chatHistory.findIndex((c) => c.id === activeChat.id);
      let nextHistory = [...chatHistory];
      if (existingIndex !== -1) {
        nextHistory[existingIndex] = { ...activeChat };
      } else {
        nextHistory.unshift({ ...activeChat });
      }
      nextHistory = nextHistory.slice(0, 100);
      persistHistory(nextHistory);
    }

    // 2️⃣ Create a new chat
    const newChat = await createChat(token, "New Chat");
    const chatObj = newChat?.id ? newChat : newChat?.chat || newChat;

    // 3️⃣ Add the new chat to history immediately
    const nextHistory = [chatObj, ...chatHistory].slice(0, 100);
    persistHistory(nextHistory);

    // 4️⃣ Set as active chat (empty messages)
    setActiveChat({ ...chatObj, messages: [] });
    setMessageInput("");

    // Optional: keep sidebar open
    setIsSidebarOpen(true);
  } catch (err) {
    console.error("Failed to create new chat:", err);
  } finally {
    setIsGenerating(false);
  }
};



  // Select chat from sidebar
  const handleSelectHistory = async (item) => {
    setActiveChat({ ...item, messages: [] });
    const token = getToken();
    await loadMessagesForChat(item.id, token);
  };

  const handleSend = async (e) => {
  e?.preventDefault();

  const content = messageInput.trim();
  if (!content) return;

  const token = getToken();
  if (!token) {
    console.warn("No token available for send");
    return;
  }

  setIsGenerating(true);

  try {
    let chatId = activeChat?.id;

    // If no active chat, create one automatically
    if (!chatId) {
      const newChat = await createChat(token, "New Chat");
      const chatObj = newChat?.id ? newChat : newChat?.chat || newChat;
      setActiveChat({ ...chatObj, messages: [] });
      chatId = chatObj.id;

      // Also add to history
      const nextHistory = [chatObj, ...chatHistory].slice(0, 100);
      persistHistory(nextHistory);
    }

    // Send message to backend
    const res = await sendMessage(token, chatId, content);

    // Normalize user/assistant messages
    const userMsg =
      res?.user_message || { id: `u-${Date.now()}`, role: "user", content };
    const assistantMsg =
      res?.assistant_message || {
        id: `a-${Date.now()}`,
        role: "assistant",
        content:
          (res && (res.message || res.response || res.text)) ||
          "No response from AI",
      };

    // Append messages to activeChat
    setActiveChat((prev) => {
      const prevMessages = prev?.messages ?? [];
      const updatedChat = {
        ...(prev || {}),
        messages: [...prevMessages, userMsg, assistantMsg],
        title: res?.chat?.title || prev?.title,
      };

      //  ✅ Update chatHistory immediately
      const existingIndex = chatHistory.findIndex((c) => c.id === updatedChat.id);
      let nextHistory = [...chatHistory];
      if (existingIndex !== -1) {
        nextHistory[existingIndex] = { ...updatedChat };
      } else {
        nextHistory.unshift({ ...updatedChat });
      }
      nextHistory = nextHistory.slice(0, 100);
      persistHistory(nextHistory);

      return updatedChat;
    });

    setMessageInput("");
  } catch (err) {
    console.error("Send message error:", err);
  } finally {
    setIsGenerating(false);
  }
};


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex bg-black font-montserrat">
      <div className="fixed left-0 top-0 h-screen w-64 md:bg-[#111] md:border-r md:border-gray-800 z-50">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          chatHistory={chatHistory}
          activeChat={activeChat}
          setActiveChat={(chat) => {
            setActiveChat(chat);
            if (chat?.id) loadMessagesForChat(chat.id);
          }}
          onNewChat={handleNewChat}
          isCreating={isGenerating}
          onOpenSearch={() => setIsSearchOpen(true)}
          onSelectHistory={handleSelectHistory}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onLogout={handleLogout}
        />
      </div>

      {/* Main content */}
      <div className="relative flex flex-1">
        {/* background decorative layers kept minimal */}
        <div className="absolute inset-0 z-0">
          <div className="bg-grid-pattern absolute inset-0 opacity-10" />
        </div>

        <div className="flex flex-1 flex-col items-center p-6 md:p-10 z-10">
          <div className="w-full max-w-xl flex-1 flex flex-col">
            {/* Header / welcome */}
            {!activeChat && (
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/20 bg-blue-600/10 px-3 py-1 mb-4">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <span className="text-xs md:text-sm font-medium text-blue-300">NupatAI</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
                  Intelligent. Fast.{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                    Helpful.
                  </span>
                </h1>
                <p className="mx-auto max-w-md text-gray-300 text-sm md:text-lg">
                    Your AI assistant is here to help you think, create, plan, and explore ideas instantly.
                  </p>
              </div>
            )}

            {/* Chat header */}
            {activeChat && (
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{activeChat.title || "Chat"}</h2>
                <div className="text-sm text-gray-400">{activeChat.messages?.length ?? 0} messages</div>
              </div>
            )}

            {/* Messages */}
            <div
              ref={messagesRef}
              className="flex-1 overflow-y-auto p-2 space-y-3 bg-transparent"
              style={{ minHeight: 200 }}
            >
              {activeChat?.messages && activeChat.messages.length > 0 ? (
                activeChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[80%] p-3 rounded-xl ${msg.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-gray-800 text-gray-200"}`}
                  >
                    {msg.content}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center mt-6">No messages yet — say hi 👋</p>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="mt-4 w-full">
              <div className="relative w-full">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                  className="h-28 w-full rounded-xl border border-gray-700 bg-gray-900 p-4 pr-20 text-white resize-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || isGenerating}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 rounded-full p-3 flex items-center justify-center disabled:opacity-50 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </form>

            {isGenerating && (
              <div className="mt-4 text-blue-300 bg-blue-600/10 border border-blue-700/40 p-3 rounded-xl text-sm">
                Processing…
              </div>
            )}
          </div>
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} chatHistory={chatHistory} onSelect={handleSelectHistory} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default MainPage;
