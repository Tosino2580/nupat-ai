import React, { useState, useEffect } from "react";
import { Code, Sparkles, Eye } from "lucide-react";
import Sidebar from "./Sidebar";

const MainPage = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedSite, setGeneratedSite] = useState("");

  // Sidebar open by default on desktop, closed on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const chatHistory = [
    "Landing page for SaaS",
    "Portfolio website concept",
    "Crypto dashboard UI",
    "Marketing email copy",
    "Fitness app homepage",
  ];

  const [previewWidth, setPreviewWidth] = useState(window.innerWidth / 2);
  const [isResizing, setIsResizing] = useState(false);
  const [previewMode, setPreviewMode] = useState("preview");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.reload();
  };

  // New chat
  const handleNewChat = () => {
    setPrompt("");
    setGeneratedSite("");
    setShowPreview(false);
  };

  // Enhance prompt
  const handleEnhancePrompt = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      setPrompt(
        `Enhance the following request: ${prompt}. Provide clarity and structure.`
      );
      setIsGenerating(false);
    }, 1500);
  };

  // Generate output
  const handleGenerateSite = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setShowPreview(true);

    setTimeout(() => {
      setGeneratedSite(`
        <html>
          <body><h1>Generated Output</h1><p>${prompt}</p></body>
        </html>
      `);
      setIsGenerating(false);
    }, 2000);
  };

  // Resize Preview Panel
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 300 && newWidth < window.innerWidth - 200) {
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

  return (
    <div className="flex min-h-screen bg-black">

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        chatHistory={chatHistory}
        handleNewChat={handleNewChat}
        handleLogout={handleLogout}
      />

      <div className="relative flex flex-1">


         <div className="absolute inset-0 z-0">
          <div className="bg-grid-pattern absolute inset-0 opacity-20"></div>
          <div className="animate-blob absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-700/40 blur-3xl"></div>
          <div className="animate-blob animation-delay-2000 absolute right-0 top-1/2 h-96 w-96 rounded-full bg-blue-500/40 blur-3xl"></div>
          <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-blue-400/40 blur-3xl"></div>
        </div>

        {/* Mobile Toggle Button - ChatGPT style */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 rounded-lg bg-blue-600 p-3 text-white shadow-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>

        {/* Main content shifts when sidebar expands (desktop) */}
        <div
          className={`flex flex-1 flex-col transition-all duration-300`}
          style={{
            marginLeft: isSidebarOpen ? "0" : "0",
          }}
        >
          {/* MAIN AREA */}
          <div
            className="relative z-10 flex flex-col p-6 md:p-10 transition-all duration-300"
            style={{ width: showPreview ? `calc(100% - ${previewWidth}px)` : "100%" }}
          >
            <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center">

              {/* Header */}
              <div className="mb-10 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-600/20 bg-blue-600/10 px-3 py-1">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <span className="text-xs md:text-sm font-medium text-blue-300">
                    AI Assistant
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

              {/* Textarea */}
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-28 w-full rounded-xl border border-gray-700 bg-gray-900 p-4 text-white resize-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ask anything…"
              />

              {/* Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleEnhancePrompt}
                  disabled={!prompt.trim() || isGenerating}
                  className="flex-1 rounded-xl bg-gray-800 text-gray-300 p-3 hover:bg-gray-700 disabled:opacity-50"
                >
                  {isGenerating ? "..." : "Enhance"}
                </button>

                <button
                  onClick={handleGenerateSite}
                  disabled={!prompt.trim() || isGenerating}
                  className="flex-1 rounded-xl bg-blue-600 text-white p-3 hover:bg-blue-500 disabled:opacity-50"
                >
                  {isGenerating ? "..." : "Generate"}
                </button>
              </div>

              {isGenerating && (
                <div className="mt-4 text-blue-300 bg-blue-600/10 border border-blue-700/40 p-3 rounded-xl text-sm">
                  Processing…
                </div>
              )}
            </div>
          </div>

          {/* Resize Handle */}
          {showPreview && (
            <div
              onMouseDown={handleMouseDown}
              className="hidden md:block w-2 cursor-col-resize bg-gray-700 hover:bg-blue-500"
            ></div>
          )}

          {/* Preview Panel */}
          {showPreview && (
            <div
              className="hidden md:flex flex-col bg-gray-900 border-l border-gray-700"
              style={{ width: `${previewWidth}px` }}
            >
              <div className="flex items-center justify-between border-b border-gray-700 p-3">
                <button
                  onClick={() => setPreviewMode("preview")}
                  className={`px-2 py-1 rounded-md text-sm ${previewMode === "preview"
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
                  <p className="text-gray-500 text-center mt-6">Ready to generate.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
