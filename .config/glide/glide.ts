// Config docs:
//
//   https://glide-browser.app/config
//
// API reference:
//
//   https://glide-browser.app/api
//
// Default config files can be found here:
//
//   https://github.com/glide-browser/glide/tree/main/src/glide/browser/base/content/plugins
//
// Most default keymappings are defined here:
//
//   https://github.com/glide-browser/glide/blob/main/src/glide/browser/base/content/plugins/keymaps.mts
//
// Try typing `glide.` and see what you can do!

// CUSTOM
/// <reference path="./glide.d.ts" />

// =============================================================================
// FIREFOX PREFERENCES (user.js replacements)
// =============================================================================
glide.prefs.set("browser.tabs.loadInBackground", true);

// Disable all smooth scrolling (instant scroll)
glide.prefs.set("general.smoothScroll", false);
glide.prefs.set("general.smoothScroll.mouseWheel", false);
glide.prefs.set("general.smoothScroll.pages", false);
glide.prefs.set("general.smoothScroll.lines", false);
glide.prefs.set("general.smoothScroll.pixels", false);
glide.prefs.set("general.smoothScroll.scrollbars", false);
glide.prefs.set("general.smoothScroll.other", false);
glide.prefs.set("general.smoothScroll.msdPhysics.enabled", false);

// Consistent distance per wheel notch
glide.prefs.set("mousewheel.acceleration.start", -1);

// =============================================================================
// HELPER FUNCTIONS (Using standard browser.* WebExtension APIs)
// =============================================================================

async function getActiveTab(): Promise<browser.tabs.Tab | undefined> {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

/** Switch active tab relative to current position (negative = left, positive = right) */
async function cycleTab(offset: number): Promise<void> {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const currentIndex = tabs.findIndex((t) => t.active);
  if (currentIndex === -1 || tabs.length <= 1) return;

  const nextIndex = (currentIndex + offset + tabs.length) % tabs.length;
  const targetTab = tabs[nextIndex];
  if (targetTab?.id) {
    await browser.tabs.update(targetTab.id, { active: true });
  }
}

/** Move tab position in the tab bar */
async function moveTab(offset: number): Promise<void> {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const active = tabs.find((t) => t.active);
  if (!active || active.index === undefined || !active.id) return;

  const newIndex = Math.max(0, Math.min(tabs.length - 1, active.index + offset));
  await browser.tabs.move(active.id, { index: newIndex });
}

/** History navigation */
async function historyNavigate(delta: -1 | 1): Promise<void> {
  const tab = await getActiveTab();
  if (!tab?.id) return;
  if (delta === -1 && typeof browser.tabs.goBack === "function") {
    await browser.tabs.goBack(tab.id);
  } else if (delta === 1 && typeof browser.tabs.goForward === "function") {
    await browser.tabs.goForward(tab.id);
  } else if (glide.content && typeof glide.content.execute === "function") {
    const fn = delta === -1 ? () => window.history.back() : () => window.history.forward();
    await glide.content.execute(fn, { tab_id: tab.id });
  }
}

/** URL path navigation ('gu') */
async function navigatePathUp(): Promise<void> {
  const tab = await getActiveTab();
  if (!tab?.url || !tab.id) return;
  try {
    const url = new URL(tab.url);
    const parts = url.pathname.replace(/\/$/, "").split("/");
    if (parts.length > 1) {
      parts.pop();
      url.pathname = parts.join("/") + "/";
      await browser.tabs.update(tab.id, { url: url.toString() });
    }
  } catch { }
}

/** Step number in URL (<C-a> / <C-x>) */
async function stepUrlNumber(step: number): Promise<void> {
  const tab = await getActiveTab();
  if (!tab?.url || !tab.id) return;
  const match = tab.url.match(/(\d+)(?!.*\d)/);
  if (match && match.index !== undefined) {
    const currentNum = parseInt(match[1], 10);
    const newNum = String(currentNum + step);
    const newUrl =
      tab.url.slice(0, match.index) +
      newNum +
      tab.url.slice(match.index + match[1].length);
    await browser.tabs.update(tab.id, { url: newUrl });
  }
}

// UI Toggles (xs, xt, xx)
let hideTabs = false;
let hideStatus = false;

function updateUI(): void {
  let styleEl = document.getElementById("glide-visibility-toggles") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "glide-visibility-toggles";
    document.head?.appendChild(styleEl);
  }
  let css = "";
  if (hideTabs) {
    css += "#TabsToolbar, #tab-bar, .tab-bar, [data-component='tabbar'] { display: none !important; } ";
  }
  if (hideStatus) {
    css += "#status-bar, .status-bar, [data-component='statusbar'] { display: none !important; } ";
  }
  styleEl.textContent = css;
}

// =============================================================================
// 1. YOUR PERSONAL OVERRIDES
// =============================================================================

// Prevent Ctrl+[ from triggering Firefox history back; sends Escape instead
glide.keymaps.set(
  ["hint", "insert", "normal"],
  "<C-[>",
  async () => {
    await glide.keys.send("<Esc>");
  },
  { description: "Ctrl+[ acts as Escape" }
);

// Tab switching (H = Left tab, L = Right tab)
glide.keymaps.set("normal", "H", async () => await cycleTab(-1), { description: "Previous tab" });
glide.keymaps.set("normal", "L", async () => await cycleTab(1), { description: "Next tab" });

// History navigation (J = Back, K = Forward)
glide.keymaps.set("normal", "J", async () => await historyNavigate(-1), { description: "Go back in history" });
glide.keymaps.set("normal", "K", async () => await historyNavigate(1), { description: "Go forward in history" });

// Tab movement (< = Move Left, > = Move Right)
glide.keymaps.set("normal", "<", async () => await moveTab(-1), { description: "Move tab left" });
glide.keymaps.set("normal", ">", async () => await moveTab(1), { description: "Move tab right" });

// UI toggles
glide.keymaps.set("normal", "xs", () => {
  hideStatus = !hideStatus;
  updateUI();
}, { description: "Toggle status bar" });

glide.keymaps.set("normal", "xt", () => {
  hideTabs = !hideTabs;
  updateUI();
}, { description: "Toggle tab bar" });

glide.keymaps.set("normal", "xx", () => {
  const toggle = !(hideTabs || hideStatus);
  hideTabs = toggle;
  hideStatus = toggle;
  updateUI();
}, { description: "Toggle tab and status bar" });

// YouTube in mpv
glide.keymaps.set("normal", "<C-S-m>", async () => {
  const tab = await getActiveTab();
  if (tab?.url) {
    await navigator.clipboard.writeText(`mpv "${tab.url}"`);
  }
}, { description: "Play current tab in mpv" });

glide.keymaps.set("normal", "<C-m>", () => {
  glide.hints.show({
    action: (target: any) => {
      const url = typeof target === "string" ? target : target?.href || target?.src;
      if (url) navigator.clipboard.writeText(`mpv "${url}"`);
    },
  });
}, { description: "Hint link to play in mpv" });

// Bitwarden rbw bindings
glide.keymaps.set("normal", ",b", () => console.log("rbw trigger"), { description: "rbw autofill" });
glide.keymaps.set("normal", ",u", () => console.log("rbw user"), { description: "rbw user" });
glide.keymaps.set("normal", ",p", () => console.log("rbw pass"), { description: "rbw pass" });

// =============================================================================
// 2. SCROLLING & NAVIGATION
// =============================================================================
// NOTE: h, j, k, l, gg, G, <C-d>, and <C-u> are built into Glide natively
// and will follow the instant scroll preferences above. Do not override them.

glide.keymaps.set(
  "normal",
  "<C-f>",
  async ({ tab_id }) => {
    await glide.content.execute(
      () => window.scrollBy({ top: window.innerHeight, behavior: "instant" }),
      { tab_id }
    );
  },
  { description: "Full page down" }
);

glide.keymaps.set(
  "normal",
  "<C-b>",
  async ({ tab_id }) => {
    await glide.content.execute(
      () => window.scrollBy({ top: -window.innerHeight, behavior: "instant" }),
      { tab_id }
    );
  },
  { description: "Full page up" }
);

// Zoom
glide.keymaps.set("normal", "-", async () => {
  const tab = await getActiveTab();
  if (tab?.id) {
    const current = await browser.tabs.getZoom(tab.id);
    await browser.tabs.setZoom(tab.id, Math.max(0.3, current - 0.1));
  }
}, { description: "Zoom out" });

glide.keymaps.set("normal", "+", async () => {
  const tab = await getActiveTab();
  if (tab?.id) {
    const current = await browser.tabs.getZoom(tab.id);
    await browser.tabs.setZoom(tab.id, Math.min(3.0, current + 0.1));
  }
}, { description: "Zoom in" });

glide.keymaps.set("normal", "=", async () => {
  const tab = await getActiveTab();
  if (tab?.id) await browser.tabs.setZoom(tab.id, 1.0);
}, { description: "Reset zoom" });

// Tabs & Windows
glide.keymaps.set("normal", "d", async () => {
  const tab = await getActiveTab();
  if (tab?.id) await browser.tabs.remove(tab.id);
}, { description: "Close tab" });

// Open new tab with Shift+O (like Ctrl+T)
glide.keymaps.set("normal", "O", async () => {
  await browser.tabs.create({});
}, { description: "Open new tab" });

glide.keymaps.set("normal", "u", async () => {
  if (browser.sessions?.restore) await browser.sessions.restore();
}, { description: "Restore closed tab" });

glide.keymaps.set("normal", "r", async () => {
  const tab = await getActiveTab();
  if (tab?.id) await browser.tabs.reload(tab.id);
}, { description: "Reload tab" });

glide.keymaps.set("normal", "R", async () => {
  const tab = await getActiveTab();
  if (tab?.id) await browser.tabs.reload(tab.id, { bypassCache: true });
}, { description: "Reload tab bypass cache" });

glide.keymaps.set("normal", "co", async () => {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const toClose = tabs.filter((t) => !t.active && t.id !== undefined).map((t) => t.id as number);
  if (toClose.length > 0) await browser.tabs.remove(toClose);
}, { description: "Close other tabs" });

glide.keymaps.set("normal", "gC", async () => {
  const tab = await getActiveTab();
  if (tab?.id) await browser.tabs.duplicate(tab.id);
}, { description: "Clone tab" });

// Direct tab selection (<A-1> to <A-9>)
for (let i = 1; i <= 9; i++) {
  glide.keymaps.set("normal", `<A-${i}>`, async () => {
    const tabs = await browser.tabs.query({ currentWindow: true });
    const target = tabs[i - 1];
    if (target?.id) await browser.tabs.update(target.id, { active: true });
  }, { description: `Switch to tab ${i}` });
}

glide.keymaps.set("normal", "<C-Tab>", async () => await cycleTab(1), { description: "Next tab" });
glide.keymaps.set("normal", "<C-S-Tab>", async () => await cycleTab(-1), { description: "Previous tab" });

// Yanking & Pasting
glide.keymaps.set("normal", "yy", async () => {
  const tab = await getActiveTab();
  if (tab?.url) await navigator.clipboard.writeText(tab.url);
}, { description: "Yank URL" });

glide.keymaps.set("normal", "yt", async () => {
  const tab = await getActiveTab();
  if (tab?.title) await navigator.clipboard.writeText(tab.title);
}, { description: "Yank page title" });

glide.keymaps.set("normal", "pp", async () => {
  const text = await navigator.clipboard.readText();
  const tab = await getActiveTab();
  if (tab?.id && text) await browser.tabs.update(tab.id, { url: text });
}, { description: "Paste and open in current tab" });

glide.keymaps.set("normal", "Pp", async () => {
  const text = await navigator.clipboard.readText();
  if (text) await browser.tabs.create({ url: text });
}, { description: "Paste and open in new tab" });

glide.keymaps.set("normal", "P", async () => {
  const text = await navigator.clipboard.readText();
  if (text) await browser.tabs.create({ url: text });
}, { description: "Paste and open in new tab" });

// URL traversal
glide.keymaps.set("normal", "gu", async () => await navigatePathUp(), { description: "Go up URL path" });
glide.keymaps.set("normal", "gU", async () => {
  const tab = await getActiveTab();
  if (tab?.url && tab.id) {
    const url = new URL(tab.url);
    await browser.tabs.update(tab.id, { url: url.origin });
  }
}, { description: "Go to domain root" });

glide.keymaps.set("normal", "<C-a>", async () => await stepUrlNumber(1), { description: "Increment URL number" });
glide.keymaps.set("normal", "<C-x>", async () => await stepUrlNumber(-1), { description: "Decrement URL number" });
