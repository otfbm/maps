#!/usr/bin/env bash

set -e

node test/input-parser.js
node test/board.js
node test/parsers/board.js
node test/parsers/icon.js
node test/parsers/token.js
node test/parsers/zoom.js