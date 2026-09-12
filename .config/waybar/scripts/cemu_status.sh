#!/bin/bash
STATE_FILE="$HOME/.config/sway/.cemu_mode"

# We use cat EOF to safely pass the JSON and Waybar span tags without quote-escaping nightmares
if [ -f "$STATE_FILE" ]; then
  cat <<'EOF'
{"text": " 󰊗  ON", "class": "on"}
EOF
else
  cat <<'EOF'
{"text": " 󰊗  OFF", "class": "off"}
EOF
fi
