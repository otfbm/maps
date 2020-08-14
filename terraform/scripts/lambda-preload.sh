#!/usr/bin/env bash

set -eEuo pipefail

lambda-preload-filename="artifacts/preload.zip"
zip -r ${lambda-preload-filename} ../preload/*
echo "Done with function bundle!"
