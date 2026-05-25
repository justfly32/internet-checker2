#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

[ ! -d node_modules ] && npm install

echo "서버 시작 중..."
node server.js &
SERVER_PID=$!

echo "http://localhost:3000 브라우저를 엽니다..."
sleep 2
open http://localhost:3000

wait $SERVER_PID
