#!/bin/bash
STATE_FILE="$HOME/.config/sway/.cemu_mode"
MOUSE="Logitech G300s Optical Gaming Mouse"
KEYBOARD="AT Translated Set 2 keyboard"
GAME_PRESET="botw"
DESKTOP_PRESET="desktop"

if [ -f "$STATE_FILE" ]; then
  rm "$STATE_FILE"
  input-remapper-control --command stop --device "$KEYBOARD"
  input-remapper-control --command start --device "$MOUSE" --preset "$DESKTOP_PRESET"
else
  touch "$STATE_FILE"
  input-remapper-control --command start --device "$MOUSE" --preset "$GAME_PRESET"
  input-remapper-control --command start --device "$KEYBOARD" --preset "$GAME_PRESET"
fi

pkill -RTMIN+8 waybar
