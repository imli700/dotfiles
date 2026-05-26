#!/bin/bash
STATE_FILE="$HOME/.config/sway/.cemu_mode"
DEVICE="Logitech G300s Optical Gaming Mouse"
PRESET="botw"

if [ -f "$STATE_FILE" ]; then
  # Turn OFF: Remove state file and stop remapper
  rm "$STATE_FILE"
  input-remapper-control --command stop --device "$DEVICE"
else
  # Turn ON: Create state file and start remapper
  touch "$STATE_FILE"
  input-remapper-control --command start --device "$DEVICE" --preset "$PRESET"
fi

# Send Signal 8 to Waybar to instantly update the UI indicator
pkill -RTMIN+8 waybar
