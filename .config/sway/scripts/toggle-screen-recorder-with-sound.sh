#!/bin/bash
# ----------------------------------------
# Full‑screen + audio → .mkv → WhatsApp‑.mp4
# ----------------------------------------

PID_FILE="/tmp/current_wf_recorder_sound.pid"
RAW_PATH_FILE="${PID_FILE}.path"
VIDEOS_BASE_DIR=$(xdg-user-dir VIDEOS 2>/dev/null || echo "$HOME/Videos")
REC_DIR="$VIDEOS_BASE_DIR/screen-recordings"
WF_LOG_FILE="/tmp/wf_recorder_sound_output.log"

# WhatsApp settings
WA_VBITRATE=800k
WA_ABITRATE=128k
WA_PROFILE="baseline"
WA_LEVEL="3.0"

mkdir -p "$REC_DIR"
[ ! -f "$PID_FILE" ] && >"$WF_LOG_FILE"

if [ -f "$PID_FILE" ]; then
  # --- STOP ---
  RAW_PID=$(<"$PID_FILE")
  RAW_FILE=$(<"$RAW_PATH_FILE")

  echo "Stopping wf-recorder w/ sound (PID: $RAW_PID)..." | tee -a "$WF_LOG_FILE"
  kill -INT "$RAW_PID"

  for i in {1..50}; do
    ps -p "$RAW_PID" &>/dev/null || break
    sleep 0.1
  done
  ps -p "$RAW_PID" &>/dev/null && kill -KILL "$RAW_PID"

  notify-send -t 3000 -i media-record "Stopped Recording" \
    "Audio raw file saved: $RAW_FILE"

  # --- TRANSCODE ---
  WA_OUT="${RAW_FILE%.mkv}_wa.mp4"
  echo "Transcoding → WhatsApp format: $WA_OUT" | tee -a "$WF_LOG_FILE"

  ffmpeg -y -i "$RAW_FILE" \
    -c:v libx264 -profile:v $WA_PROFILE -level $WA_LEVEL -pix_fmt yuv420p \
    -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
    -b:v $WA_VBITRATE -maxrate $WA_VBITRATE -bufsize $WA_VBITRATE \
    -c:a aac -b:a $WA_ABITRATE \
    -movflags +faststart \
    "$WA_OUT" >>"$WF_LOG_FILE" 2>&1

  if [ $? -eq 0 ]; then
    rm -f "$RAW_FILE" "$RAW_PATH_FILE" "$PID_FILE"
    notify-send -t 3000 -i video-x-generic "Converted" \
      "With‑sound → WhatsApp‑ready:\n$WA_OUT"
  else
    notify-send -u critical -t 3000 -i dialog-error "Converted" \
      "Transcode FAILED! See $WF_LOG_FILE"
  fi

else
  # --- START ---
  RAW_FILE="$REC_DIR/$(date +'%Y_%m_%d-%H%M%S').mkv"
  echo "Starting wf-recorder w/ sound → $RAW_FILE" | tee -a "$WF_LOG_FILE"

  wf-recorder --audio -f "$RAW_FILE" &>>"$WF_LOG_FILE" &
  echo $! >"$PID_FILE"
  echo "$RAW_FILE" >"$RAW_PATH_FILE"

  notify-send -t 3000 -i media-record "Screen Recording" \
    "Started with sound. Raw file:\n$RAW_FILE"
fi
