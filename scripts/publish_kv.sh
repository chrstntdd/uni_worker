#!/bin/sh

# Consider https://developers.cloudflare.com/workers/tooling/wrangler/kv_commands/#kv-bulk and some script to build the JSON 
RUNTIME_MOD=$(find dist/browser/js -name "runtime*.js") 
MAIN_ENTRY_MOD=$(find dist/browser/js -name "main-*.js") 
REACT_MOD=$(find dist/browser/js -name "react-*.js") 
DATA_MGMT_MOD=$(find dist/browser/js -name "data-mgmt*.js") 

wrangler kv:key put --namespace-id $WEB_ASSET_KV_ID "runtime.js" --path $RUNTIME_MOD
wrangler kv:key put --namespace-id $WEB_ASSET_KV_ID "main.js" --path $MAIN_ENTRY_MOD
wrangler kv:key put --namespace-id $WEB_ASSET_KV_ID "react.js" --path $REACT_MOD
wrangler kv:key put --namespace-id $WEB_ASSET_KV_ID "data-mgmt.js" --path $DATA_MGMT_MOD

