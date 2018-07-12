#!/bin/bash
# Executes tests for commands (*/test_*.js).
set -euo pipefail

export COPYQ_SESSION=command-tests
export COPYQ_SESSION_COLOR=red
export COPYQ_SETTINGS_PATH=/tmp/copyq-command-tests-config
export COPYQ_LOG_LEVEL=DEBUG
export COPYQ=${COPYQ:-copyq}

copyq_pid=""

stop_server() {
    if [[ -n "$copyq_pid" ]]; then
        kill "$copyq_pid" && wait "$copyq_pid" || true
        copyq_pid=""
    fi
    rm -rf "$COPYQ_SETTINGS_PATH"
}

start_server() {
    mkdir -p "$COPYQ_SETTINGS_PATH"
    "$COPYQ" &
    copyq_pid=$!
}

init_server() {
    "$COPYQ" show
    "$COPYQ" copy '' > /dev/null
}

run_script() {
    js=$1
    cat "$js" | "$COPYQ" 'source("utils/test_functions.js")' eval -
}

trap stop_server QUIT TERM INT HUP EXIT

for js in tests/*.js; do
    echo "*** Starting: $js"

    stop_server
    start_server
    init_server

    run_script "$js"

    echo "*** Finished: $js"
done
