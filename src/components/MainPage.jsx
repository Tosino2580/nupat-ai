/**
 * MainPage (clean, uses Sidebar + SearchModal)
 */

import React, { useEffect, useMemo, useState } from "react";
import { Sparkles, Eye } from "lucide-react";
import Sidebar from "./Sidebar";
import SearchModal from "./SearchModal";
import SettingsModal from "./SettingsModal";

const STORAGE_KEY = "nonaai_chat_history_v1";

const MainPage = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedSite, setGeneratedSite] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [previewWidth, setPreviewWidth] = useState(window.innerWidth / 2);
  const [isResizing, setIsResizing] = useState(false);
  const [previewMode, setPreviewMode] = useState("preview");

  // NEW: Input docks to bottom when preview is open
  const isInputDocked = showPreview;

  const persistHistory = (next) => {
    setChatHistory(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn("Failed to save history", e);
    }
  };

  const summarize = (text) => {
    if (!text) return "New conversation";
    const trimmed = text.trim().replace(/\s+/g, " ");
    if (trimmed.length <= 60) return trimmed;
    return trimmed.slice(0, 60).trim() + "…";
  };

  const handleNewChat = () => {
    if (prompt.trim() || generatedSite) {
      const item = {
        id: Date.now().toString(),
        summary: summarize(prompt || generatedSite),
        prompt,
        generatedSite,
        ts: Date.now(),
      };
      persistHistory([item, ...chatHistory].slice(0, 100));
    }

    setPrompt("");
    setGeneratedSite("");
    setShowPreview(false);
  };

  const handleSelectHistory = (item) => {
    setPrompt(item.prompt || "");
    setGeneratedSite(item.generatedSite || "");
    setShowPreview(Boolean(item.generatedSite));
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 360 && newWidth < window.innerWidth - 360) {
        setPreviewWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => setIsResizing(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.reload();
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setShowPreview(true);

    setTimeout(() => {
      const html = `<html><body><h1>Result</h1><p>${prompt}</p></body></html>`;
      setGeneratedSite(html);

      const item = {
        id: Date.now().toString(),
        summary: summarize(prompt),
        prompt,
        generatedSite: html,
        ts: Date.now(),
      };

      persistHistory([item, ...chatHistory].slice(0, 100));

      setPrompt("");
      setIsGenerating(false);
    }, 1100);
  };

  return (
    <div className="min-h-screen flex bg-black font-montserrat">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectHistory={handleSelectHistory}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
      />

      <div className="relative flex flex-1">
        {/* Background animations */}
        <div className="absolute inset-0 z-0">
          <div className="bg-grid-pattern absolute inset-0 opacity-20"></div>
          <div className="animate-blob absolute left-0 top-0 h-96 w-30 md:w-96 rounded-full bg-blue-700/40 blur-3xl"></div>
          <div className=" animation-delay-2000 absolute right-0 top-1/2 h-30 md:h-80 w-30 md:w-96 rounded-full bg-blue-500/40 blur-3xl"></div>
          <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/4 h-96 w-30 md:w-96 rounded-full bg-blue-400/40 blur-3xl"></div>
        </div>

        {/* MAIN CONTENT */}
        <div
          className={`flex flex-1 flex-col items-center transition-all duration-300`}
        >
          <div
            className="relative z-10 flex flex-col p-6 md:p-10 mt-30 md:mt-0 transition-all duration-300"
            style={{ width: showPreview ? `calc(100% - ${previewWidth}px)` : "100%" }}
          >
            <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center">

              {/* HEADER hidden when preview is open */}
              {!showPreview && (
                <div className="mb-10 text-center fade-in">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-600/20 bg-blue-600/10 px-3 py-1">
                    <Sparkles className="h-4 w-4 text-blue-400" />
                    <span className="text-xs md:text-sm font-medium text-blue-300">
                      NupatAI
                    </span>
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

              {/* ✔ FIXED INPUT BAR WHEN PREVIEW OPENS */}
              <div
                className={`${
                  isInputDocked
                    ? "fixed bottom-0 left-0 w-full  p-4  border-gray-800 z-50 md:ml-20"
                    : "relative mt-4"
                } transition-all duration-300`}
              >
                <div className="relative w-full max-w-xl mx-auto">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSend(e)
                    }
                    className="h-28 w-full rounded-xl border border-gray-700 bg-gray-900 p-4 pr-14 text-white resize-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ask anything…"
                  />

                  {/* Telegram send button */}
                  <button
                    onClick={handleSend}
                    disabled={!prompt.trim() || isGenerating}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 rounded-full p-3 flex items-center justify-center disabled:opacity-50 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {isGenerating && (
                <div className="mt-4 text-blue-300 bg-blue-600/10 border border-blue-700/40 p-3 rounded-xl text-sm">
                  Processing…
                </div>
              )}
            </div>
          </div>

          {/* RESIZER BAR */}
          {showPreview && (
            <div
              onMouseDown={handleMouseDown}
              className="hidden md:block w-2 cursor-col-resize bg-gray-700 hover:bg-blue-500"
            ></div>
          )}

          {/* PREVIEW PANEL */}
          {showPreview && (
            <div
              className="flex md:flex flex-col  bg-gray-900 border-l border-gray-700"
              style={{ width:  window.innerWidth < 768 ? '96%' : `${previewWidth}px` }}
            >
              <div className="flex items-center justify-between border-b border-gray-700 p-3">
                <button
                  onClick={() => setPreviewMode("preview")}
                  className={`px-2 py-1 rounded-md text-sm ${
                    previewMode === "preview"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  <Eye className="inline h-4 w-4 mr-1" /> Preview
                </button>

                <button
                  className="text-xl text-gray-400 hover:text-white"
                  onClick={() => setShowPreview(false)}
                >
                  ×
                </button>
              </div>

              <div className="flex-1 p-3">
                {generatedSite ? (
                  <iframe
                    className="w-full h-full bg-white rounded-lg border border-gray-700"
                    srcDoc={generatedSite}
                    title="Preview"
                  ></iframe>
                ) : (
                  <p className="text-gray-500 text-center mt-6">
                    Ready to generate.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        chatHistory={chatHistory}
        onSelect={handleSelectHistory}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default MainPage;
