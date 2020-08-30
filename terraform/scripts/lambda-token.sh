#!/usr/bin/env bash

set -eEuo pipefail

lambda_token_filename="artifacts/token.zip"
rm -f ../${lambda_token_filename}
zip -jr ../${lambda_token_filename} ../../token/*
echo "Done with function bundle!"
