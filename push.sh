#!/bin/bash

if [ -n "$1" ]; then
  commit_message="$1"
else
  date_now=$(date +"%Y-%m-%d %H:%M")
  commit_message="Automatic commit: $date_now"
fi

git add .
git commit -m "$commit_message"
git push origin main
