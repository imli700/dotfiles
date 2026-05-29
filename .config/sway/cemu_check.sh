#!/bin/bash
USER_HOME="/home/imli700"
STATE_FILE="$USER_HOME/.config/sway/.cemu_mode"
MOUSE="Logitech G300s Optical Gaming Mouse"
KEYBOARD="AT Translated Set 2 keyboard"
PRESET="botw"

if [ -f "$STATE_FILE" ]; then
  /usr/bin/input-remapper-control --command start --device "$MOUSE" --preset "$PRESET"
  /usr/bin/input-remapper-control --command start --device "$KEYBOARD" --preset "$PRESET"
else
  /usr/bin/input-remapper-control --command stop --device "$MOUSE"
  /usr/bin/input-remapper-control --command stop --device "$KEYBOARD"
fi
