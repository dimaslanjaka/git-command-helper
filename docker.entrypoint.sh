#!/bin/bash

mkdir -p tmp/logs

# Remove packageManager from package.json if it exists
if command -v jq >/dev/null 2>&1; then
  jq 'del(.packageManager)' package.json > temp.json && mv temp.json package.json
fi

# Run build
if [ -f package-lock.json ]; then
  npm run build
elif [ -f yarn.lock ]; then
  yarn run build
fi

# Run tests
if command -v tee >/dev/null 2>&1; then
  npm test 2>&1 | tee tmp/logs/node-14.test.log
else
  npm test > tmp/logs/node-14.test.log 2>&1
fi

# Re-remove packageManager from package.json if it exists
if command -v jq >/dev/null 2>&1; then
  jq 'del(.packageManager)' package.json > temp.json && mv temp.json package.json
fi