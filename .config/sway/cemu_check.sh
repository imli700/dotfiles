#!/bin/bash
USER_HOME="/home/imli700"
STATE_FILE="$USER_HOME/.config/sway/.cemu_mode"
DEVICE="Logitech G300s Optical Gaming Mouse"
PRESET="botw"

if [ -f "$STATE_FILE" ]; then
  /usr/bin/input-remapper-control --command start --device "$DEVICE" --preset "$PRESET"
else
  /usr/bin/input-remapper-control --command stop --device "$DEVICE"
fi
