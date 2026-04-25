#!/bin/bash
# Wrapper para que el preview tool use Node 22 (la PATH default es Node 16).
export PATH="/opt/homebrew/bin:$PATH"
export FONTAWESOME_NPM_AUTH_TOKEN=$(grep -E '^FONTAWESOME_NPM_AUTH_TOKEN=' .env | cut -d= -f2)
exec npm run dev
