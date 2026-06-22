#!/bin/bash
USER_HOME="/home/your_username_here"
STATE_FILE="$USER_HOME/.config/sway/.cemu_mode"
MOUSE="Logitech G300s Optical Gaming Mouse"
KEYBOARD="AT Translated Set 2 keyboard"
GAME_PRESET="botw"
DESKTOP_PRESET="desktop"

if [ -f "$STATE_FILE" ]; then
  /usr/bin/input-remapper-control --command start --device "$MOUSE" --preset "$GAME_PRESET"
  /usr/bin/input-remapper-control --command start --device "$KEYBOARD" --preset "$GAME_PRESET"
else
  /usr/bin/input-remapper-control --command start --device "$MOUSE" --preset "$DESKTOP_PRESET"
  /usr/bin/input-remapper-control --command stop --device "$KEYBOARD"
fi
