/**
    * @description      : 
    * @author           : fortu
    * @group            : 
    * @created          : 22/11/2025 - 16:40:30
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/11/2025
    * - Author          : fortu
    * - Modification    : 
**/
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const SettingsModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState("general");

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("nonaai_dark_mode") === "true";
  });

  const [textSize, setTextSize] = useState(() => {
    return localStorage.getItem("nonaai_text_size") || "medium";
  });

  // apply settings immediately
  useEffect(() => {
    localStorage.setItem("nonaai_dark_mode", darkMode);
    document.documentElement.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("nonaai_text_size", textSize);
    document.documentElement.style.setProperty(
      "--chat-font-size",
      textSize === "small"
        ? "14px"
        : textSize === "large"
        ? "18px"
        : "16px"
    );
  }, [textSize]);

  // ESC to close
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg rounded-xl bg-gray-900 border border-gray-800 shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button className="p-2 text-gray-400 hover:bg-gray-800 rounded" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {["general", "appearance", "account"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded text-sm ${
                tab === t
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "general" && (
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-white mb-1 font-medium">App Behavior</h3>
              <p className="text-sm text-gray-500">Standard default options — more coming soon.</p>
            </div>
          </div>
        )}

        {tab === "appearance" && (
          <div className="space-y-6 text-gray-300">
            {/* Dark Mode */}
            <div>
              <label className="flex items-center justify-between">
                <span>Dark Mode</span>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  className="toggle-checkbox"
                />
              </label>
            </div>

            {/* Font Size */}
            <div>
              <label className="block mb-2">Font Size</label>
              <select
                value={textSize}
                onChange={(e) => setTextSize(e.target.value)}
                className="bg-gray-800 text-gray-300 rounded p-2 w-full"
              >
                <option value="small">Small</option>
                <option value="medium">Normal</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        )}

        {tab === "account" && (
          <div className="text-gray-300 space-y-3">
            <p>Email: <span className="text-gray-400">user@example.com</span></p>
            <p>Status: <span className="text-gray-400">Free Tier</span></p>
            <p className="text-sm text-gray-500">Account management coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
