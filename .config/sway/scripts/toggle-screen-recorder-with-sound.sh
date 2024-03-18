#!/bin/bash

pid=$(pgrep wf-recorder)
status=$?

if [ $status != 0 ]; then
	wf-recorder --audio -f $(xdg-user-dir Videos)/screen-recordings/$(date +'recording-%Y_%m_%d-%Hh_%Mm_%Ss.mp4')
else
	pkill --signal SIGINT wf-recorder
fi
