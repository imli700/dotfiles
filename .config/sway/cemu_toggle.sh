#!/bin/bash
STATE_FILE="$HOME/.config/sway/.cemu_mode"
MOUSE="Logitech G300s Optical Gaming Mouse"
KEYBOARD="AT Translated Set 2 keyboard"
PRESET="botw"

if [ -f "$STATE_FILE" ]; then
  # Turn OFF: Remove state file and stop remapper for both
  rm "$STATE_FILE"
  input-remapper-control --command stop --device "$MOUSE"
  input-remapper-control --command stop --device "$KEYBOARD"
else
  # Turn ON: Create state file and start remapper for both
  touch "$STATE_FILE"
  input-remapper-control --command start --device "$MOUSE" --preset "$PRESET"
  input-remapper-control --command start --device "$KEYBOARD" --preset "$PRESET"
fi

# Send Signal 8 to Waybar to instantly update the UI indicator
pkill -RTMIN+8 waybar
