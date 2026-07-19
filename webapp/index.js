export const openid = {
  authorization_endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  token_endpoint: "https://oauth2.googleapis.com/token",
  userinfo_endpoint: "https://openidconnect.googleapis.com/v1/userinfo",
  scopes_supported: ["openid", "profile", "email"],
  client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  realm: "",
};

export const getTitle = "AI Document Chat";
export const getWelcomeMessage =
  "Upload your documents and start chatting to get AI-powered answers.";
export const getInputPlaceholder = "Type your question here...";

export const sendIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 2L11 13"></path>
    <path d="M22 2L15 22L11 13L2 9L22 2"></path>
  </svg>
  `;

export const themeColor = "#3b82f6";
export const Navbar = true;
export const botName = "James Bot";
export const enabled = true;
export const showUserResponseFirst = true;
export const hideEditButton = true;
export const leftPanelEnabled = true;
export const drawerEnabled = true;
export const showHistory = true;
export const conversational = true;
export const loaderEnabled = true;
export const referenceDocumentViewEnabled = true;
export const hideUserIcon = true;
export const hideBotIcon = false;

export const howToUseSteps = [
  {
    number: 1,
    title: "Upload Your Documents",
    description: "Tap + to add your files.",
  },
  {
    number: 2,
    title: "Wait for Processing",
    description: "Your document will be analyzed in a moment.",
  },
  {
    number: 3,
    title: "Start Chatting",
    description: "Ask any question about your document.",
  },
];

export const leftPanelHtml = `
  <style>
    .ttt-left-panel {
      width: 220px;
      height: 100%;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      padding: 20px 0;
      transition: width 0.3s ease;
      overflow: hidden;
    }
    .ttt-left-panel.collapsed {
      width: 60px;
    }
    .ttt-left-panel.collapsed .ttt-nav-text {
      display: none;
    }
    .ttt-nav-btn {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 20px;
      cursor: pointer;
      transition: all 0.2s;
      color: #6b7280;
      font-size: 15px;
      font-weight: 400;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      white-space: nowrap;
    }
    .ttt-nav-btn:hover {
      background: #f9fafb;
      color: #3b82f6;
    }
    .ttt-nav-btn.active {
      background: #eff6ff;
      color: #3b82f6;
      font-weight: 500;
    }
    .ttt-nav-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
  </style>
  <div class="ttt-left-panel" id="ttt-left-panel">
    <button class="ttt-nav-btn active">
      <svg class="ttt-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span class="ttt-nav-text">New chat</span>
    </button>
    <button class="ttt-nav-btn">
      <svg class="ttt-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span class="ttt-nav-text">History</span>
    </button>
    <button class="ttt-nav-btn">
      <svg class="ttt-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
      <span class="ttt-nav-text">Settings</span>
    </button>
  </div>
`;

export const handleLeftPanel = (f, d) => {
  if (f === "toggle") {
    const cardId = d;
    const content = document.getElementById(cardId + "-content");
    content.classList.toggle("active");
  }
};

export const headerPaneHtml = `
  <style>
    .ttt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 100%;
      width: 100%;
    }
    .ttt-header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .ttt-header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .ttt-toggle-btn {
      width: 32px;
      height: 32px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      padding: 0;
    }
    .ttt-toggle-btn:hover {
      background: #f9fafb;
      border-color: #3b82f6;
    }
    .ttt-toggle-btn svg {
      width: 18px;
      height: 18px;
      color: #3b82f6;
    }
    .ttt-header-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }
    .ttt-user-wrap {
      position: relative;
    }
    .ttt-user-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px 6px 6px;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      user-select: none;
    }
    .ttt-user-pill:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }
    .ttt-user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #8b5cf6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 13px;
      font-weight: 600;
      flex-shrink: 0;
    }
    .ttt-user-meta {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
      text-align: left;
    }
    .ttt-user-name {
      font-size: 14px;
      color: #374151;
      font-weight: 500;
    }
    .ttt-user-email {
      font-size: 11px;
      color: #9ca3af;
      font-weight: 400;
    }
    .ttt-chevron {
      width: 14px;
      height: 14px;
      color: #9ca3af;
      transition: transform 0.2s;
    }
    .ttt-user-wrap.open .ttt-chevron {
      transform: rotate(180deg);
    }
    .ttt-dropdown {
      display: none;
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      min-width: 180px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.10);
      z-index: 200;
      overflow: hidden;
      padding: 4px 0;
    }
    .ttt-user-wrap.open .ttt-dropdown {
      display: block;
    }
    .ttt-dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      font-size: 14px;
      color: #374151;
      cursor: pointer;
      transition: background 0.15s;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      font-family: inherit;
    }
    .ttt-dropdown-item:hover {
      background: #f9fafb;
    }
    .ttt-dropdown-item svg {
      width: 16px;
      height: 16px;
      color: #6b7280;
      flex-shrink: 0;
    }
    .ttt-dropdown-item.danger {
      color: #ef4444;
    }
    .ttt-dropdown-item.danger svg {
      color: #ef4444;
    }
    .ttt-dropdown-divider {
      height: 1px;
      background: #f3f4f6;
      margin: 4px 0;
    }
  </style>
  <div class="ttt-header">
    <div class="ttt-header-left">
      <button class="ttt-toggle-btn" onclick="window.toggleLeftPanel ? window.toggleLeftPanel() : document.getElementById('ttt-left-panel')?.classList.toggle('collapsed')" title="Toggle Sidebar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
      </button>
      <span class="ttt-header-title">AI Document Chat</span>
    </div>
    <div class="ttt-header-right">
      <button class="ttt-toggle-btn" onclick="window.toggleDrawer?.()" title="Toggle Documents">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
      </button>
      <div class="ttt-user-wrap" id="ttt-user-wrap">
        <div class="ttt-user-pill" onclick="document.getElementById('ttt-user-wrap').classList.toggle('open')">
          <div class="ttt-user-avatar">U</div>
          <div class="ttt-user-meta">
            <span class="ttt-user-name">User</span>
            <span class="ttt-user-email"></span>
          </div>
          <svg class="ttt-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        <div class="ttt-dropdown">
          <button class="ttt-dropdown-item danger" onclick="window.handleLogout && window.handleLogout()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
        </div>
      </div>
    </div>
  </div>
`;

export const handleHeaderPane = (f) => {
  if (f === "login") {
    setTimeout(() => {
      const logout = document.getElementById("logout-btn");
      logout && logout.classList.add("active");
      const prompt = document.getElementById("prompt-btn");
      prompt && prompt.classList.add("active");
      const publish = document.getElementById("publish-btn");
      publish && publish.classList.add("active");
    }, 5000);
  }
};

export const leftPanelStateUpdate = (stepIndex) => {
  stepIndex = stepIndex - 1;
  const steps = document.querySelectorAll(".step");
  steps.forEach((step, index) => {
    step.classList.remove("completed", "active", "upcoming");
    if (index < stepIndex) {
      step.classList.add("completed");
    } else if (index === stepIndex) {
      step.classList.add("active");
    } else {
      step.classList.add("upcoming");
    }
  });
};

export const showUserEnteredPassword = false;
export const finalMessage = "Thanks for chatting with James Bot!";

export const editButtonColor = "#3b82f6";

export const trainedChatbotUrl =
  "https://llm-connect.kg.hybrid.chat/data/list?chatbot_id=document-pQc007";
export const trainedChatbotProgressUrl =
  "https://llm-connect.kg.hybrid.chat/data/progress?file_name=";
export const documentUploadUrl =
  "https://llm-connect.kg.hybrid.chat/data/upload?chatbot_id=document-pQc007";
export const trainedChatbotId = "pQc007";
export const trainedChatbotAPIKey = "rooifQWjo8wH4uwvSYtWtUiXavzhjbXe";

export const chatbotIcon = `
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#3b82f6" stroke-width="2"/>
      <circle cx="12" cy="10" r="3" fill="#3b82f6"/>
      <path d="M7 15C7 15 8 17 12 17C16 17 17 15 17 15" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
