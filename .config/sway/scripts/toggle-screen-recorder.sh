#!/bin/bash

PID_FILE="/tmp/current_wf_recorder.pid"
REC_DIR="$HOME/Videos/screen-recordings"
WF_LOG_FILE="/tmp/wf_recorder_output.log" # Log file for wf-recorder's own output

# Ensure recording directory exists
mkdir -p "$REC_DIR"
# Clear old log file for this session when starting a new recording instance
# If PID file doesn't exist, it implies we are trying to start.
if [ ! -f "$PID_FILE" ]; then
  >"$WF_LOG_FILE"
fi

if [ -f "$PID_FILE" ]; then
  # PID file exists, so we try to stop the recording
  PID_TO_KILL=$(cat "$PID_FILE")
  if ps -p "$PID_TO_KILL" >/dev/null && grep -q "wf-recorder" "/proc/$PID_TO_KILL/comm" 2>/dev/null; then
    echo "Stopping wf-recorder (PID: $PID_TO_KILL)... Log: $WF_LOG_FILE" | tee -a "$WF_LOG_FILE"
    notify-send -t 3000 -i "media-record" "Screen Recording" "Stopping..."
    kill -INT "$PID_TO_KILL" # Send SIGINT to the specific process

    wait_time=0
    max_wait_seconds=5 # Wait up to 5 seconds
    while ps -p "$PID_TO_KILL" >/dev/null && [ $(echo "$wait_time < $max_wait_seconds" | bc -l) -eq 1 ]; do
      sleep 0.1
      wait_time=$(echo "$wait_time + 0.1" | bc -l)
    done

    if ps -p "$PID_TO_KILL" >/dev/null; then
      echo "wf-recorder (PID: $PID_TO_KILL) did not terminate gracefully after $max_wait_seconds seconds. Forcing kill." | tee -a "$WF_LOG_FILE"
      kill -KILL "$PID_TO_KILL"
      notify-send -t 5000 -u critical -i "media-record" "Screen Recording" "Forced stop. Video might be corrupt."
    else
      echo "wf-recorder (PID: $PID_TO_KILL) stopped." | tee -a "$WF_LOG_FILE"
      notify-send -t 5000 -i "video-x-generic" "Screen Recording" "Stopped. File saved."
    fi
    rm -f "$PID_FILE"
  else
    echo "Stale PID file found (PID: $PID_TO_KILL potentially). Process not running or not wf-recorder. Removing PID file." | tee -a "$WF_LOG_FILE"
    rm -f "$PID_FILE"
  fi
else
  # PID file does not exist, so start recording
  FILENAME="$REC_DIR/$(date +'recording-%Y_%m_%d-%Hh_%Mm_%Ss.mp4')" # Changed to .mp4
  echo "Attempting to start wf-recorder, saving to $FILENAME. Log: $WF_LOG_FILE" | tee -a "$WF_LOG_FILE"

  wf-recorder -f "$FILENAME" >"$WF_LOG_FILE" 2>&1 &
  NEW_PID=$!

  sleep 0.5

  if ps -p "$NEW_PID" >/dev/null && grep -q "wf-recorder" "/proc/$NEW_PID/comm" 2>/dev/null; then
    echo "$NEW_PID" >"$PID_FILE"
    notify-send -t 5000 -i "media-record" "Screen Recording" "Started. Saving to:\n$FILENAME"
    echo "wf-recorder started successfully (PID: $NEW_PID)." | tee -a "$WF_LOG_FILE"
  else
    notify-send -t 5000 -u critical -i "dialog-error" "Screen Recording" "FAILED to start. Check log:\n$WF_LOG_FILE"
    echo "wf-recorder FAILED to start or exited immediately. Check $WF_LOG_FILE for errors." | tee -a "$WF_LOG_FILE"
  fi
fi
