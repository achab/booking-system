#!/bin/bash
# wait-for-contract.sh

set -e

host="$1"
shift
cmd="$@"

FILE=/app/build/contracts/.SUCCESS
until (test -f "$FILE"); do
    >&2 echo "Contract is not deployed yet - sleeping"
    sleep 2
done

>&2 echo "Contract is deployed - starting the app"
exec $cmd
