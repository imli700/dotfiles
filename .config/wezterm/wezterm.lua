-- Final working WezTerm configuration.
-- Uses WezTerm default keybinds for splitting and tmux-style leader keys for everything else.

local wezterm = require("wezterm")
local config = wezterm.config_builder()

--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
--                               Appearance
--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

config.font = wezterm.font("JetBrainsMono Nerd Font Mono")
config.font_size = 16
config.term = "xterm-256color"

config.colors = {
	foreground = "#cdd6f4",
	background = "#1e1e2e",
	cursor_bg = "#f5e0dc",
	cursor_border = "#f5e0dc",
	cursor_fg = "#11111b",
	selection_bg = "#585b70",
	selection_fg = "#cdd6f4",
	ansi = {
		"#45475a",
		"#f38ba8",
		"#a6e3a1",
		"#f9e2af",
		"#89b4fa",
		"#f5c2e7",
		"#94e2d5",
		"#bac2de",
	},
	brights = {
		"#585b70",
		"#f38ba8",
		"#a6e3a1",
		"#f9e2af",
		"#89b4fa",
		"#f5c2e7",
		"#94e2d5",
		"#a6adc8",
	},
}

config.window_background_gradient = {
	colors = { "#1e1e2ecc" },
}

--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
--                               Behavior
--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

config.tab_and_split_indices_are_zero_based = false
config.scrollback_lines = 10000
config.enable_kitty_keyboard = true

config.status_update_interval = 1000
wezterm.on("update-right-status", function(window, pane)
	window:set_right_status(wezterm.format({
		{ Foreground = { Color = "#89b4fa" } },
		{ Text = "Switch tab: Alt+Tab | Help: F1 " },
	}))
end)

--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
--                              Keybindings
--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

config.leader = { key = "m", mods = "ALT", timeout_milliseconds = 2000 }

config.keys = {
	-- Global keybindings
	{ key = "Tab", mods = "ALT", action = wezterm.action.ActivateTabRelative(1) },
	{ key = "F1", mods = "NONE", action = wezterm.action.ShowDebugOverlay },

	-- Default WezTerm Split Keybindings
	-- These do not use the LEADER key.
	{ key = "%", mods = "CTRL|SHIFT", action = wezterm.action.SplitVertical({ domain = "CurrentPaneDomain" }) },
	{ key = '"', mods = "CTRL|SHIFT", action = wezterm.action.SplitHorizontal({ domain = "CurrentPaneDomain" }) },

	-- Your tmux-navigator style pane switching
	{ key = "h", mods = "CTRL", action = wezterm.action.ActivatePaneDirection("Left") },
	{ key = "j", mods = "CTRL", action = wezterm.action.ActivatePaneDirection("Down") },
	{ key = "k", mods = "CTRL", action = wezterm.action.ActivatePaneDirection("Up") },
	{ key = "l", mods = "CTRL", action = wezterm.action.ActivatePaneDirection("Right") },

	-- Your tmux-style LEADER keybindings
	{ key = "c", mods = "LEADER", action = wezterm.action.SpawnTab("CurrentPaneDomain") },
	{ key = "n", mods = "LEADER", action = wezterm.action.ActivateTabRelative(1) },
	{ key = "p", mods = "LEADER", action = wezterm.action.ActivateTabRelative(-1) },
	{ key = "&", mods = "LEADER", action = wezterm.action.CloseCurrentTab({ confirm = true }) },
	{ key = "x", mods = "LEADER", action = wezterm.action.CloseCurrentPane({ confirm = true }) },
	{ key = "z", mods = "LEADER", action = wezterm.action.TogglePaneZoomState },
	{ key = "[", mods = "LEADER", action = wezterm.action.ActivateCopyMode },
}

-- Add numeric tab navigation
for i = 1, 9 do
	table.insert(config.keys, {
		key = tostring(i),
		mods = "LEADER",
		action = wezterm.action.ActivateTab(i),
	})
end

--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
--                            Initial Windows (Disabled)
--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
--[[
wezterm.on('gui-startup', function(cmd)
  local mux = wezterm.mux
  local tab, pane, window = mux.spawn_window(cmd or {})
  tab:set_title('shell')
  window:gui_window():maximize()

  local function spawn_and_title(win, title, command)
    local new_tab, _, _ = win:spawn_tab({ args = command, })
    new_tab:set_title(title)
  end

  spawn_and_title(window, 'log', { 'tail', '-F', '/tmp/anaconda.log' })
  spawn_and_title(window, 'storage-log', { 'tail', '-F', '/tmp/storage.log' })
  spawn_and_title(window, 'program-log', { 'tail', '-F', '/tmp/program.log' })
  spawn_and_title(window, 'packaging-log', { 'tail', '-F', '/tmp/packaging.log' })

  window:tabs()[1]:activate()
end)
--]]

return config
