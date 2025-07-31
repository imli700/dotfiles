# pylint: disable=C0111

# Python standard library imports
import os
from urllib.request import urlopen

# For opening pdf files
import subprocess

# Third-party imports
# (catppuccin module import removed as it's no longer used directly)

# Qutebrowser specific imports
from qutebrowser.config.configfiles import ConfigAPI
from qutebrowser.config.config import ConfigContainer
from pathlib import Path  # Still used for _catppuccin_local_theme_script

# Qutebrowser objects `c` and `config` are injected globally by qutebrowser.
config: ConfigAPI = config  # type: ignore
c: ConfigContainer = c  # type: ignore

# ===================================================================
# === Catppuccin Theme (UI) ===
# ===================================================================
config.load_autoconfig()

catppuccin_qutebrowser_setup_py_url = (
    "https://raw.githubusercontent.com/catppuccin/qutebrowser/main/setup.py"
)
_catppuccin_local_theme_script = config.configdir / "theme.py"

if not os.path.exists(_catppuccin_local_theme_script):
    try:
        with urlopen(catppuccin_qutebrowser_setup_py_url) as themehtml:
            with open(_catppuccin_local_theme_script, "a", encoding="utf-8") as file:
                file.writelines(themehtml.read().decode("utf-8"))
    except Exception as e:
        print(f"ERROR: Could not download Catppuccin theme setup script: {e}")

if os.path.exists(_catppuccin_local_theme_script):
    try:
        import theme  # type: ignore

        theme.setup(c, "mocha", True)  # type: ignore
    except Exception as e:
        print(
            f"ERROR: Could not apply Catppuccin UI theme from {_catppuccin_local_theme_script}: {e}"
        )

# ===================================================================
# === Gruvbox theme (UI) ===
# ===================================================================
# config.source("./themes/gruvbox.py")


# ===================================================================
# === Web Content Theming (Qutebrowser Built-in Dark Mode) ===
# ===================================================================
# Enable qutebrowser's built-in dark mode for web pages.
c.colors.webpage.darkmode.enabled = True

# Optionally, you can also set the preferred color scheme for websites
# that support CSS `prefers-color-scheme`. This complements darkmode.enabled.
c.colors.webpage.preferred_color_scheme = "dark"

# The c.colors.webpage.bg setting is no longer needed here as
# darkmode.enabled = True will handle background adjustments.
# If you had c.colors.webpage.bg = "white" or similar, it's removed.
# If you want a specific fallback dark background if a page doesn't respond well:
# c.colors.webpage.bg = "#1e1e2e" # Example: Catppuccin Mocha base
# However, for "default dark theme setting", relying on darkmode.enabled is usually sufficient.


# ===================================================================
# === Session Management ===
# ===================================================================
c.auto_save.session = True
c.session.lazy_restore = True

# ===================================================================
# === URL / Search / Start Pages ===
# ===================================================================
c.url.searchengines = {
    "DEFAULT": "https://www.google.com/search?q={}",
    "ddg": "https://duckduckgo.com/?q={}",
    "yt": "https://www.youtube.com/results?search_query={}",
}
c.url.start_pages = ["https://www.google.com"]
c.url.default_page = "https://www.google.com"

# ===================================================================
# === Keybindings ===
# ===================================================================
# Fix inverted tab movement
config.unbind("J", mode="normal")
config.unbind("K", mode="normal")
config.bind("J", "tab-prev", mode="normal")
config.bind("K", "tab-next", mode="normal")

# Keybinds to toggle statusbar, tabs, or both
config.bind("xs", "config-cycle statusbar.show always never")
config.bind("xt", "config-cycle tabs.show always never")
config.bind(
    "xx",
    "config-cycle statusbar.show always never;; config-cycle tabs.show always never",
)

# 1. Change Shift+J from default 'tab-next' (right tab) to 'back' (previous site in history)
#    Note: 'J' in qutebrowser bindings implies Shift+j
config.bind("J", "back", mode="normal")

# 2. Change Shift+K from default 'tab-prev' (left tab) to 'forward' (next site in history)
#    Note: 'K' in qutebrowser bindings implies Shift+k
config.bind("K", "forward", mode="normal")

# 3. Change Shift+H from default 'back' (previous site in history) to 'tab-prev' (left tab)
#    Note: 'H' in qutebrowser bindings implies Shift+h
config.bind("H", "tab-prev", mode="normal")

# 4. Change Shift+L from default 'forward' (next site in history) to 'tab-next' (right tab)
#    Note: 'L' in qutebrowser bindings implies Shift+l
config.bind("L", "tab-next", mode="normal")

# ===================================================================
# === Download bar ===
# ===================================================================
# Position the download bar at the bottom of the window.
c.downloads.position = "bottom"

# Remove the download bar in set milliseconds after download finishes
c.downloads.remove_finished = 20000

# ===================================================================
# === Appearance / Zoom ===
# ===================================================================
c.zoom.default = "150%"

# ===================================================================
# === Ad-blocking ===
# ===================================================================
c.content.blocking.enabled = True
c.content.blocking.adblock.lists = [
    "https://raw.githubusercontent.com/ewpratten/youtube_ad_blocklist/master/blocklist.txt",
    "https://easylist.to/easylist/easylist.txt",
    "https://easylist.to/easylist/easyprivacy.txt",
    "https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/annoyances.txt",
    "https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/badware.txt",
]

# ===================================================================
# === Other useful settings (optional) ===
# ===================================================================
c.downloads.location.directory = "~/Downloads"
c.spellcheck.languages = ["en-US"]

# ===================================================================
# === Notification settings ===
# ===================================================================
config.set("content.notifications.enabled", True, "https://web.whatsapp.com")
config.set("content.notifications.enabled", True, "https://mail.google.com")
config.set("content.notifications.enabled", True, "https://web.telegram.org")
config.set("content.notifications.enabled", True, "https://discord.com")

# ===================================================================
# === Open Youtube videos in mpv ===
# ===================================================================
# Bindings for playing videos in mpv

# 1. Play the video URL of the *current* page in mpv
# This is useful when you are already on the YouTube video's page.
# Keybinding: Ctrl+Shift+M (as seen in your video)
config.bind("<Ctrl-Shift-m>", "spawn mpv {url}")

# 2. Use hints to select a link on the page and play it in mpv
# This is useful for playing a video from the YouTube homepage or a subscription feed.
# Keybinding: Ctrl+M (as seen in your video)
config.bind("<Ctrl-m>", "hint links spawn mpv {hint-url}")

# ===================================================================
# === Always show scrollbar ===
# ===================================================================
c.scrolling.bar = "always"

# End of config.py
