#!/bin/bash

pid=$(pgrep wf-recorder)
status=$?

if [ $status != 0 ]; then
  # Get the XDG Videos directory (typically $HOME/Videos)
  # Ensure xdg-user-dirs is installed for this to work reliably
  VIDEOS_BASE_DIR=$(xdg-user-dir VIDEOS 2>/dev/null || echo "$HOME/Videos")

  # Define the target directory
  REC_DIR="$VIDEOS_BASE_DIR/screen-recordings"
  # Create the directory if it doesn't exist (and any parent directories)
  mkdir -p "$REC_DIR"
  # Start recording
  wf-recorder --audio -f "$REC_DIR/$(date +'recording-%Y_%m_%d-%Hh_%Mm_%Ss.mp4')"
else
  pkill --signal SIGINT wf-recorder
fi
