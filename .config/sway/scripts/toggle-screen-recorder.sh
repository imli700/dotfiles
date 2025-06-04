#!/bin/bash

pid=$(pgrep wf-recorder)
status=$?

if [ $status != 0 ]; then
  # Define the target directory
  REC_DIR="$HOME/Videos/screen-recordings"
  # Create the directory if it doesn't exist (and any parent directories)
  mkdir -p "$REC_DIR"
  # Start recording
  wf-recorder -f "$REC_DIR/$(date +'recording-%Y_%m_%d-%Hh_%Mm_%Ss.mp4')"
else
  pkill --signal SIGINT wf-recorder
fi
