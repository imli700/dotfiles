#!/bin/bash

# Get the exact mode name string from your sway config
# Ensure this matches EXACTLY what's in `set $mode_system ...` in sway config
TARGET_MODE="System (l) lock, (e) logout, (s) suspend, (r) reboot, (CTRL+s) shutdown"

# Get current binding state from sway as JSON
CURRENT_MODE_JSON=$(swaymsg -t get_binding_state)

# Extract the name of the current mode using jq
CURRENT_MODE_NAME=$(echo "$CURRENT_MODE_JSON" | jq -r '.name')

# Check if the current mode is the target system mode
if [[ "$CURRENT_MODE_NAME" == "$TARGET_MODE" ]]; then
  # If it is, output the desired text in Waybar JSON format
  # You can customize the text here. Using the mode name itself works well.
  # Adding a specific CSS class 'system-mode-active' for styling
  echo "{\"text\": \"$TARGET_MODE\", \"tooltip\": \"System Actions Active\", \"class\": \"system-mode-active\"}"
else
  # If not in the target mode, output an empty JSON object
  # This makes the Waybar module effectively disappear
  echo "{}"
fi
