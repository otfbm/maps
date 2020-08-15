#!/usr/bin/env bash

set -eEuo pipefail

lambda_preload_layer_filename="artifacts/preload-layer.zip"
docker run -v "$PWD":/var/task "lambci/lambda:build-python3.8" /bin/sh -c "pip install -r preload-requirements.txt -t python/lib/python3.8/site-packages/; exit"
zip -r ../${lambda_preload_layer_filename} python > /dev/null
rm -r python
echo "Done creating layer!"
