#!/bin/sh

export $(cat .env)

NODE_ENV="production"; export NODE_ENV

rm -rf dist
echo "🧨 Removed old assets 🧨"

yarn build:prod
echo "🕸 Compiled with webpack"

./publish_kv.sh
echo "📝  Published inline browser modules"

wrangler publish
echo "🚢  Final publish to workers"