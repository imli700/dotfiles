#!/bin/bash
STATE_FILE="$HOME/.config/sway/.cemu_mode"

# We use cat EOF to safely pass the JSON and Waybar span tags without quote-escaping nightmares
if [ -f "$STATE_FILE" ]; then
  cat <<'EOF'
{"text": "<span color='#202020' bgcolor='#d3869b'> 󰊗 </span> ON", "class": "on"}
EOF
else
  cat <<'EOF'
{"text": "<span color='#202020' bgcolor='#928374'> 󰊗 </span> OFF", "class": "off"}
EOF
fi
