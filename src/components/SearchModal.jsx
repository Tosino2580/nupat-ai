/**
    * @description      : 
    * @author           : fortu
    * @group            : 
    * @created          : 22/11/2025 - 16:36:18
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/11/2025
    * - Author          : fortu
    * - Modification    : 
**/
import React, { useEffect, useMemo, useState } from "react";
import { X, Search as SearchIcon } from "lucide-react";

const SearchModal = ({ isOpen, onClose, chatHistory = [], onSelect }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  // close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chatHistory;
    return chatHistory.filter(
      (h) =>
        (h.summary && h.summary.toLowerCase().includes(q)) ||
        (h.prompt && h.prompt.toLowerCase().includes(q)) ||
        (h.generatedSite && h.generatedSite.toLowerCase().includes(q))
    );
  }, [query, chatHistory]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-6"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl rounded-xl bg-gray-900 border border-gray-800 p-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <SearchIcon className="text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full bg-transparent outline-none text-white placeholder-gray-500"
            />
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-800 transition text-gray-400"
            aria-label="Close search"
          >
            <X />
          </button>
        </div>

        <div className="mt-4 max-h-64 overflow-auto">
          {filtered.length === 0 ? (
            <div className="text-gray-500 p-4">No results</div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="cursor-pointer p-3 rounded-lg hover:bg-gray-800/60 transition flex items-center justify-between"
              >
                <div>
                  <div className="text-sm text-white">{item.summary}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{item.prompt}</div>
                </div>
                <div className="text-xs text-gray-400 ml-4">{new Date(item.ts).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
