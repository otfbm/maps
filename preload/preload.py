#!/usr/bin/env python3

import io
import json
import os
import warnings

import boto3
import requests
from PIL import Image

warnings.simplefilter('error', Image.DecompressionBombWarning)
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    imgUrlEnc = event['pathParameters']['url']
    imgUrl = base64.b64decode(event['pathParameters']['url'])
    bucket = os.environ['BUCKET']
    s3Url = os.environ['URL']

    with io.BytesIO() as buffer:
        download_img(buffer, imgUrl)
        limit_img_size(
            buffer,
            os.environ['TARGET_BYTES'],  # target image size
            tolerance=os.environ['SIZE_TOLERANCE']  # percent of what the file may be bigger than TARGET_BYTES
        )

        s3_client.upload_fileobj(buffer.getvalue(), bucket, imgUrlEnc,
                                 ExtraArgs={'Metadata': {'CacheControl': 'max-age=259200'}})

    response = {}
    response['statusCode'] = 301
    response['headers']={'Location': f'{s3Url}/{imgUrlEnc}'}
    data = {}
    response['body']=json.dumps(data)
    return response

def download_img(buffer, url):
    resp = requests.get(url, stream=True)
    # TODO err handling
    if resp.status_code == 200:
        for chunk in resp:
            buffer.write(chunk)

def limit_img_size(buffer, target_filesize, tolerance=5):
    img = img_orig = Image.open(buffer).convert('RGB')
    aspect = img.size[0] / img.size[1]

    while True:
        buffer.truncate(0)
        buffer.seek(0)
        img.save(buffer, format="JPEG", optimize=True, quality=1)
        data = buffer.getvalue()
        filesize = len(data)
        size_deviation = filesize / target_filesize
       # print("size: {}; factor: {:.3f}".format(filesize, size_deviation))

        if size_deviation <= (100 + tolerance) / 100:
            # filesize fits
            return
        else:
            # filesize not good enough => adapt width and height
            # use sqrt of deviation since applied both in width and height
            new_width = img.size[0] / size_deviation ** 0.5
            new_height = new_width / aspect
            # resize from img_orig to not lose quality
            img = img_orig.resize((int(new_width), int(new_height)))
