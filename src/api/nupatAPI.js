// src/services/nupatApi.js

const BASE_URL = "https://nupatai.onrender.com";

// Helper function to handle fetch responses
async function handleResponse(res) {
  try {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail ? JSON.stringify(data.detail) : `API Error: ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}

// authentication

export async function signup(data) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function login(data) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function logout(token) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

export async function getCurrentUser(token) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

// for the chats

export async function createChat(token, title) {
  const res = await fetch(`${BASE_URL}/api/v1/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
}

export async function getUserChats(token) {
  const res = await fetch(`${BASE_URL}/api/v1/chats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

export async function getChatById(token, chatId) {
  const res = await fetch(`${BASE_URL}/api/v1/chats/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

export async function updateChat(token, chatId, newTitle) {
  const res = await fetch(`${BASE_URL}/api/v1/chats/${chatId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: newTitle }),
  });
  return handleResponse(res);
}

export async function deleteChat(token, chatId) {
  const res = await fetch(`${BASE_URL}/api/v1/chats/${chatId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

// for the messages

export async function sendMessage(token, chatId, message) {
  const res = await fetch(`${BASE_URL}/api/v1/chats/${chatId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
  return handleResponse(res);
}

export async function getMessages(token, chatId) {
  const res = await fetch(`${BASE_URL}/api/v1/chats/${chatId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}
