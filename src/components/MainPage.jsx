/**
    * @description      : 
    * @author           : fortu
    * @group            : 
    * @created          : 22/11/2025 - 14:41:12
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/11/2025
    * - Author          : fortu
    * - Modification    : 
**/
/**
 * MainPage Component
 */

import React, { useState, useEffect } from "react";
import { Code, Sparkles, Wand2, Eye } from "lucide-react";
import Sidebar from "./Sidebar";

const MainPage = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedSite, setGeneratedSite] = useState("");

  // Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fake chat history
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

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.reload();
  };

  const handleNewChat = () => {
    setPrompt("");
    setGeneratedSite("");
    setShowPreview(false);
  };

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

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 400 && newWidth < window.innerWidth - 400) {
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

      {/* Main Content */}
      <div className="relative flex flex-1">

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="bg-grid-pattern absolute inset-0 opacity-20"></div>
          <div className="animate-blob absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-700/40 blur-3xl"></div>
          <div className="animate-blob animation-delay-2000 absolute right-0 top-1/2 h-96 w-96 rounded-full bg-blue-500/40 blur-3xl"></div>
          <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-blue-400/40 blur-3xl"></div>
        </div>

        {/* Main Work Area */}
        <div
          className="relative z-10 flex flex-col p-10 transition-all duration-300"
          style={{ width: showPreview ? `calc(100% - ${previewWidth}px)` : "100%" }}
        >
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center">

            {/* Header */}
            <div className="mb-12 text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-600/20 bg-blue-600/10 px-4 py-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">
                  AI Assistant
                </span>
              </div>

              <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl">
                Intelligent. Fast.  
                <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                  Helpful.
                </span>
              </h1>

              <p className="mx-auto max-w-xl text-lg text-gray-300 md:text-xl">
                Your AI assistant is here to provide insights, suggestions, and solutions instantly – making every task smarter and easier.
              </p>
            </div>

            {/* Input */}
            <div className="space-y-6">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-32 w-full resize-none rounded-xl border border-gray-700/60 bg-gray-900/60 p-4 text-white focus:ring-2 focus:ring-blue-500/40"
                  placeholder="Ask anything…"
                />

                <Code className="absolute bottom-3 right-3 h-5 w-5 text-gray-500" />
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={handleEnhancePrompt}
                  disabled={!prompt.trim() || isGenerating}
                  className="flex-1 rounded-xl border border-gray-700/60 bg-gray-900/60 p-3 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                >
                  {isGenerating ? "..." : "Enhance"}
                </button>

                <button
                  onClick={handleGenerateSite}
                  disabled={!prompt.trim() || isGenerating}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 p-3 text-white hover:from-blue-500 hover:to-blue-300 disabled:opacity-50"
                >
                  {isGenerating ? "..." : "Generate"}
                </button>
              </div>
            </div>

            {/* Status */}
            {isGenerating && (
              <div className="mt-6 rounded-xl border border-blue-600/20 bg-blue-600/10 p-4 text-blue-300">
                Processing…
              </div>
            )}
          </div>
        </div>

        {/* Resizer */}
        {showPreview && (
          <div
            onMouseDown={handleMouseDown}
            className="w-2 cursor-col-resize bg-gray-700 hover:bg-blue-500"
          ></div>
        )}

        {/* Preview Panel */}
        {showPreview && (
          <div
            className="flex flex-col border-l border-gray-700/60 bg-gray-900/60 backdrop-blur-sm"
            style={{ width: `${previewWidth}px` }}
          >
            <div className="flex items-center justify-between border-b border-gray-700/60 p-4">
              <div>
                <button
                  onClick={() => setPreviewMode("preview")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    previewMode === "preview"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  <Eye className="mr-1 inline h-4 w-4" />
                  Preview
                </button>

                <button
                  onClick={() => setPreviewMode("code")}
                  className={`ml-2 px-3 py-1 rounded-md text-sm ${
                    previewMode === "code"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  <Code className="mr-1 inline h-4 w-4" />
                  Code
                </button>
              </div>

              <button
                className="text-2xl text-gray-400 hover:text-white"
                onClick={() => setShowPreview(false)}
              >
                &times;
              </button>
            </div>

            <div className="flex-1 p-4">
              {generatedSite ? (
                previewMode === "preview" ? (
                  <iframe
                    className="h-full w-full rounded-lg border border-gray-700 bg-white"
                    srcDoc={generatedSite}
                    title="Preview"
                  ></iframe>
                ) : (
                  <pre className="h-full w-full overflow-auto rounded-lg border border-gray-700 bg-gray-900 p-4 text-sm text-white">
                    <code>{generatedSite}</code>
                  </pre>
                )
              ) : (
                <div className="mt-10 text-center text-gray-500">
                  Ready to generate.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
