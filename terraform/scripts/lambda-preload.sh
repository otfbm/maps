#!/usr/bin/env bash

set -eEuo pipefail

lambda_preload_filename="artifacts/preload.zip"
rm -f ../${lambda_preload_filename}
zip -jr ../${lambda_preload_filename} ../../preload/*
echo "Done with function bundle!"
