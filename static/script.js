const selectScreen = document.getElementById("select-screen");
const chatScreen = document.getElementById("chat-screen");
const chatAvatar = document.getElementById("chat-avatar");
const chatModeName = document.getElementById("chat-mode-name");
const chatStatus = document.getElementById("chat-status");
const messagesEl = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const switchModeBtn = document.getElementById("switch-mode");

const MODE_INFO = {
  "1": { name: "Angry", blobClass: "blob-angry", status: "furious, but online", cssVar: "--angry" },
  "2": { name: "Funny", blobClass: "blob-funny", status: "online, allegedly", cssVar: "--funny" },
  "3": { name: "Sad",   blobClass: "blob-sad",   status: "barely here",        cssVar: "--sad" },
};

let currentMode = null;
let history = []; // { role: "user" | "assistant", content: string }

document.querySelectorAll(".dial").forEach((dial) => {
  dial.addEventListener("click", () => {
    const mode = dial.dataset.mode;
    startChat(mode);
  });
});

switchModeBtn.addEventListener("click", () => {
  currentMode = null;
  history = [];
  messagesEl.innerHTML = "";
  chatScreen.classList.add("hidden");
  selectScreen.classList.remove("hidden");
});

function startChat(mode) {
  currentMode = mode;
  history = [];
  messagesEl.innerHTML = "";

  const info = MODE_INFO[mode];
  document.documentElement.style.setProperty("--mood", `var(${info.cssVar})`);
  chatAvatar.className = "avatar-blob " + info.blobClass;
  chatModeName.textContent = info.name;
  chatStatus.textContent = info.status;

  selectScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");
  chatInput.focus();
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text || !currentMode) return;

  chatInput.value = "";
  addMessage("user", text);
  const thinkingEl = addThinking();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: currentMode, history: history, prompt: text }),
    });

    const data = await res.json();
    thinkingEl.remove();

    if (!res.ok) {
      addMessage("bot", "Something broke: " + (data.error || "unknown error"));
      return;
    }

    history.push({ role: "user", content: text });
    history.push({ role: "assistant", content: data.content });
    addMessage("bot", data.content);
  } catch (err) {
    thinkingEl.remove();
    addMessage("bot", "Couldn't reach the server. Is the backend running?");
  }
});

function addMessage(role, content) {
  const div = document.createElement("div");
  div.className = "msg " + (role === "user" ? "user" : "bot");
  div.textContent = content;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

function addThinking() {
  const div = document.createElement("div");
  div.className = "msg thinking";
  div.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}
