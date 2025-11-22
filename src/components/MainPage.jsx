/**
    * @description      : 
    * @author           : fortu
    * @group            : 
    * @created          : 22/11/2025 - 16:36:33
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/11/2025
    * - Author          : fortu
    * - Modification    : 
**/
/**
 * MainPage (clean, uses Sidebar + SearchModal)
 */

import React, { useEffect, useMemo, useState } from "react";
import { Code, Sparkles, Wand2, Eye } from "lucide-react";
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


  // persisted chat history
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

  // helpers
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
    // If there's content, save it as a history item
    if (prompt.trim() || generatedSite) {
      const id = Date.now().toString();
      const item = {
        id,
        summary: summarize(prompt || generatedSite),
        prompt: prompt,
        generatedSite,
        ts: Date.now(),
      };
      const next = [item, ...chatHistory].slice(0, 100); // cap
      persistHistory(next);
    }
    // reset editor
    setPrompt("");
    setGeneratedSite("");
    setShowPreview(false);
  };

  const handleEnhancePrompt = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setPrompt((prev) => `Enhance: ${prev}`);
      setIsGenerating(false);
    }, 900);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setShowPreview(true);

    // fake generation
    setTimeout(() => {
      const html = `<html><body><h1>Result</h1><p>${prompt}</p></body></html>`;
      setGeneratedSite(html);

      // auto-save to history as final item
      const id = Date.now().toString();
      const item = {
        id,
        summary: summarize(prompt),
        prompt,
        generatedSite: html,
        ts: Date.now(),
      };
      const next = [item, ...chatHistory].slice(0, 100);
      persistHistory(next);

      setIsGenerating(false);
    }, 1100);
  };

  // handle selecting a history item (loads prompt + preview)
  const handleSelectHistory = (item) => {
    setPrompt(item.prompt || "");
    setGeneratedSite(item.generatedSite || "");
    setShowPreview(Boolean(item.generatedSite));
  };

  // resizer
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

  // derived for quick UI
  const latestSummary = useMemo(() => (chatHistory[0] ? chatHistory[0].summary : ""), [chatHistory]);

  // logout
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    // optionally clear history? we keep it
    window.location.reload();
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


      <div className="relative z-10 flex flex-1">

        {/* background blobs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="absolute left-0 top-0 w-96 h-96 rounded-full bg-blue-700/40 blur-3xl animate-blob" />
          <div className="absolute right-0 top-1/2 w-96 h-96 rounded-full bg-blue-500/40 blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-blue-400/40 blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* main content */}
        <div
          className="relative z-10 flex flex-col p-10 transition-all duration-300"
          style={{ width: showPreview ? `calc(100% - ${previewWidth}px)` : "100%" }}
        >
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">

            {/* header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center mb-6 gap-2 border border-blue-600/20 bg-blue-600/10 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">AI Assistant</span>
              </div>

              <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-6">
                Intelligent. Fast.
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                  Helpful.
                </span>
              </h1>

              <p className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto">
                {latestSummary || "Ask anything—your assistant will summarize and save chats automatically."}
              </p>
            </div>

            {/* input */}
            <div className="space-y-6">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask anything…"
                  className="w-full h-32 rounded-xl bg-gray-900/60 border border-gray-700/60 text-white p-4 resize-none focus:ring-2 focus:ring-blue-500/40"
                />
                <Code className="w-5 h-5 text-gray-500 absolute bottom-3 right-3" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleEnhancePrompt}
                  disabled={!prompt.trim() || isGenerating}
                  className="flex-1 border border-gray-700/60 bg-gray-900/60 p-3 rounded-xl text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                >
                  {isGenerating ? "..." : "Enhance"}
                </button>

                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 p-3 rounded-xl text-white hover:from-blue-500 hover:to-blue-300 disabled:opacity-50"
                >
                  {isGenerating ? "..." : "Generate"}
                </button>
              </div>
            </div>

            {/* status */}
            {isGenerating && (
              <div className="mt-6 border border-blue-600/20 bg-blue-600/10 p-4 rounded-xl text-blue-300">
                Processing…
              </div>
            )}
          </div>
        </div>

        {/* resizer */}
        {showPreview && (
          <div onMouseDown={handleMouseDown} className="w-2 bg-gray-700 cursor-col-resize hover:bg-blue-500" />
        )}

        {/* preview */}
        {showPreview && (
          <div className="flex flex-col border-l border-gray-700/60 bg-gray-900/60 backdrop-blur-sm" style={{ width: `${previewWidth}px` }}>
            <div className="flex items-center justify-between p-4 border-b border-gray-700/60">
              <div>
                <button onClick={() => setPreviewMode("preview")} className={`px-3 py-1 rounded-md text-sm ${previewMode === "preview" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800"}`}>
                  <Eye className="inline w-4 h-4 mr-1" /> Preview
                </button>
                <button onClick={() => setPreviewMode("code")} className={`ml-2 px-3 py-1 rounded-md text-sm ${previewMode === "code" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800"}`}>
                  <Code className="inline w-4 h-4 mr-1" /> Code
                </button>
              </div>

              <button className="text-2xl text-gray-400 hover:text-white" onClick={() => setShowPreview(false)}>&times;</button>
            </div>

            <div className="p-4 flex-1">
              {generatedSite ? (
                previewMode === "preview" ? (
                  <iframe className="w-full h-full rounded-lg bg-white border border-gray-700" srcDoc={generatedSite} title="Preview" />
                ) : (
                  <pre className="bg-gray-900 p-4 rounded-lg text-white text-sm w-full h-full overflow-auto border border-gray-700">
                    <code>{generatedSite}</code>
                  </pre>
                )
              ) : (
                <div className="text-gray-500 text-center mt-10">Ready to generate.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        chatHistory={chatHistory}
        onSelect={(item) => handleSelectHistory(item)}
      />

      <SettingsModal
  isOpen={isSettingsOpen}
  onClose={() => setIsSettingsOpen(false)}
/>

    </div>
  );
};

export default MainPage;
