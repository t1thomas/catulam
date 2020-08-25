#!/bin/bash -eu

IFS=',' read -ra NEO4J <<< "$NEO4J"

ELAPSED=0

while true; do
  sleep 5
  ELAPSED=$((ELAPSED + 5))

  UP=0
  for host in "${NEO4J[@]}"; do
    if curl -s -I http://"${host}":7474 | grep -q "200 OK"; then
      UP=$((UP + 1))
    fi
  done

  if [ "$UP" -eq "${#NEO4J[@]}" ]; then
    echo "All hosts are available after $ELAPSED seconds"
    exit 0
  else
    echo "Only $UP hosts up so far [${ELAPSED}s]"
    continue
  fi
done
