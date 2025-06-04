#!/bin/bash

PID_FILE="/tmp/current_wf_recorder_sound.pid"
VIDEOS_BASE_DIR=$(xdg-user-dir VIDEOS 2>/dev/null || echo "$HOME/Videos")
REC_DIR="$VIDEOS_BASE_DIR/screen-recordings"
WF_LOG_FILE="/tmp/wf_recorder_sound_output.log"

mkdir -p "$REC_DIR"
if [ ! -f "$PID_FILE" ]; then
  >"$WF_LOG_FILE"
fi

if [ -f "$PID_FILE" ]; then
  PID_TO_KILL=$(cat "$PID_FILE")
  if ps -p "$PID_TO_KILL" >/dev/null && grep -q "wf-recorder" "/proc/$PID_TO_KILL/comm" 2>/dev/null; then
    echo "Stopping wf-recorder with sound (PID: $PID_TO_KILL)... Log: $WF_LOG_FILE" | tee -a "$WF_LOG_FILE"
    notify-send -t 3000 -i "media-record" "Screen Recording (Sound)" "Stopping..."
    kill -INT "$PID_TO_KILL"

    wait_time=0
    max_wait_seconds=5
    while ps -p "$PID_TO_KILL" >/dev/null && [ $(echo "$wait_time < $max_wait_seconds" | bc -l) -eq 1 ]; do
      sleep 0.1
      wait_time=$(echo "$wait_time + 0.1" | bc -l)
    done

    if ps -p "$PID_TO_KILL" >/dev/null; then
      echo "wf-recorder with sound (PID: $PID_TO_KILL) did not terminate gracefully. Forcing kill." | tee -a "$WF_LOG_FILE"
      kill -KILL "$PID_TO_KILL"
      notify-send -t 5000 -u critical -i "media-record" "Screen Recording (Sound)" "Forced stop. Video might be corrupt."
    else
      echo "wf-recorder with sound (PID: $PID_TO_KILL) stopped." | tee -a "$WF_LOG_FILE"
      notify-send -t 5000 -i "video-x-generic" "Screen Recording (Sound)" "Stopped. File saved."
    fi
    rm -f "$PID_FILE"
  else
    echo "Stale sound PID file found (PID: $PID_TO_KILL). Removing." | tee -a "$WF_LOG_FILE"
    rm -f "$PID_FILE"
  fi
else
  FILENAME="$REC_DIR/$(date +'recording-%Y_%m_%d-%Hh_%Mm_%Ss.mp4')" # Changed to .mp4
  echo "Attempting to start wf-recorder with sound, saving to $FILENAME. Log: $WF_LOG_FILE" | tee -a "$WF_LOG_FILE"

  wf-recorder --audio -f "$FILENAME" >"$WF_LOG_FILE" 2>&1 &
  NEW_PID=$!

  sleep 0.5

  if ps -p "$NEW_PID" >/dev/null && grep -q "wf-recorder" "/proc/$NEW_PID/comm" 2>/dev/null; then
    echo "$NEW_PID" >"$PID_FILE"
    notify-send -t 5000 -i "media-record" "Screen Recording (Sound)" "Started. Saving to:\n$FILENAME"
    echo "wf-recorder with sound started successfully (PID: $NEW_PID)." | tee -a "$WF_LOG_FILE"
  else
    notify-send -t 5000 -u critical -i "dialog-error" "Screen Recording (Sound)" "FAILED to start. Check log:\n$WF_LOG_FILE"
    echo "wf-recorder with sound FAILED to start or exited immediately. Check $WF_LOG_FILE for errors." | tee -a "$WF_LOG_FILE"
  fi
fi
