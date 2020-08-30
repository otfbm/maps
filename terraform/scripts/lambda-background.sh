#!/usr/bin/env bash

set -eEuo pipefail

lambda_background_filename="artifacts/background.zip"
rm -f ../${lambda_background_filename}
zip -jr ../${lambda_background_filename} ../../background/*
echo "Done with function bundle!"
