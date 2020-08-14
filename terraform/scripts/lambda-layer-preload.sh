#!/usr/bin/env bash

set -eEuo pipefail

lambda-preload-layer-filename="artifacts/preload-layer.zip"
docker run -v "$PWD":/var/task "lambci/lambda:build-python3.8" /bin/sh -c "pip install -r preload-requirements.txt -t python/lib/python3.8/site-packages/; exit"
zip -r ${lambda-preload-layer-filename} python > /dev/null
rm -r python
echo "Done creating layer!"
