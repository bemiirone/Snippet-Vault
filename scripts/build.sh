#!/bin/bash
set -e

echo "=== Installing dependencies ==="
npm install

echo "=== Building Angular ==="
cd web
node ../node_modules/@angular/cli/bin/ng.js build
cd ..

echo "=== Building NestJS API ==="
node node_modules/typescript/bin/tsc -p api/tsconfig.json

echo "=== Build complete ==="
