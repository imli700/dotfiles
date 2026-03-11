#!/bin/bash
# ----------------------------------------
# Full‑screen recorder → .mkv → WhatsApp‑.mp4
# ----------------------------------------

# State files
PID_FILE="/tmp/current_wf_recorder.pid"
RAW_PATH_FILE="/tmp/current_wf_recorder.path"
REC_DIR="$HOME/Videos/screen-recordings"
WF_LOG_FILE="/tmp/wf_recorder_output.log"

# WhatsApp settings
WA_VBITRATE=800k
WA_ABITRATE=128k
WA_PROFILE="baseline"
WA_LEVEL="3.0"

mkdir -p "$REC_DIR"

if [ -f "$PID_FILE" ]; then
  # --- STOP RECORDING ---

  # 1. ATOMIC LOCK: We rename the PID file uniquely for this specific script instance.
  # If 10 keypresses happen at once, only ONE will succeed in moving the file.
  # The other 9 will fail silently and exit, completely preventing the race condition.
  CLAIMED_PID_FILE="${PID_FILE}.$$.tmp"

  if mv "$PID_FILE" "$CLAIMED_PID_FILE" 2>/dev/null; then
    RAW_PID=$(<"$CLAIMED_PID_FILE")
    RAW_FILE=$(<"$RAW_PATH_FILE")

    # Clean up the path and temporary pid files IMMEDIATELY.
    # This prevents the script from ever getting "stuck" if ffmpeg fails later.
    rm -f "$RAW_PATH_FILE" "$CLAIMED_PID_FILE"

    echo "Stopping wf-recorder (PID: $RAW_PID)..." >>"$WF_LOG_FILE"

    # Graceful stop
    kill -INT "$RAW_PID" 2>/dev/null

    # Wait up to 5s for the MKV file to finalize safely
    for i in {1..50}; do
      ps -p "$RAW_PID" &>/dev/null || break
      sleep 0.1
    done
    ps -p "$RAW_PID" &>/dev/null && kill -KILL "$RAW_PID" 2>/dev/null

    # Notify user that recording stopped and conversion is starting
    notify-send -t 3000 -i media-record "Stopped Recording" "Raw file saved. Transcoding in background..."

    # --- TRANSCODE to WhatsApp format (IN BACKGROUND) ---
    WA_OUT="${RAW_FILE%.mkv}_wa.mp4"

    # Wrapping the ffmpeg command in ( ... ) & runs it in the background.
    # This frees up the script immediately, allowing you to start a NEW screen
    # recording while the previous one is still transcoding!
    (
      echo "Transcoding → WhatsApp format: $WA_OUT" >>"$WF_LOG_FILE"

      ffmpeg -y -i "$RAW_FILE" \
        -c:v libx264 -profile:v "$WA_PROFILE" -level "$WA_LEVEL" -pix_fmt yuv420p \
        -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
        -b:v "$WA_VBITRATE" -maxrate "$WA_VBITRATE" -bufsize "$WA_VBITRATE" \
        -c:a aac -b:a "$WA_ABITRATE" \
        -movflags +faststart \
        "$WA_OUT" >>"$WF_LOG_FILE" 2>&1

      if [ $? -eq 0 ]; then
        rm -f "$RAW_FILE"
        notify-send -t 4000 -i video-x-generic "Converted Successfully" "WhatsApp‑ready file:\n$WA_OUT"
      else
        notify-send -u critical -t 5000 -i dialog-error "Conversion Failed" "Transcode FAILED! See $WF_LOG_FILE"
      fi
    ) &

  else
    # Another script instance already grabbed the PID file (key bounce). Exit silently.
    exit 0
  fi

else
  # --- START RECORDING to MKV ---

  # Append to log instead of overwriting, so we don't break the log of a background transcode
  echo "--- NEW RECORDING SESSION ---" >>"$WF_LOG_FILE"

  RAW_FILE="$REC_DIR/$(date +'%Y_%m_%d-%H%M%S').mkv"
  echo "Starting wf-recorder → $RAW_FILE" >>"$WF_LOG_FILE"

  # Start wf-recorder
  wf-recorder -f "$RAW_FILE" &>>"$WF_LOG_FILE" &
  WF_PID=$!

  # Save state files
  echo "$WF_PID" >"$PID_FILE"
  echo "$RAW_FILE" >"$RAW_PATH_FILE"

  # Start notification
  notify-send -t 3000 -i media-record "Screen Recording" "Started. Raw file:\n$RAW_FILE"
fi
