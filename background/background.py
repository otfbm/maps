#!/usr/bin/env python3

import base64
import io
import json
import os
import warnings

import boto3
import requests
from PIL import Image

warnings.simplefilter('error', Image.DecompressionBombWarning)


def lambda_handler(event, context):
    s3_client = boto3.client('s3')
    imgUrlEnc = event['pathParameters']['url']
    imgUrl = base64.b64decode(event['pathParameters']['url'])
    bucket = os.environ['BUCKET']
    s3Url = os.environ['URL']

    with io.BytesIO() as buffer:
        download_img(buffer, imgUrl)
        limit_img_size(
            buffer,
            int(os.environ['TARGET_BYTES']),  # target image size
            tolerance=int(os.environ['SIZE_TOLERANCE'])  # percent of what the file may be bigger than TARGET_BYTES
        )

        buffer.seek(0)  # rewind file pointer before read
        s3_client.upload_fileobj(buffer, bucket, imgUrlEnc,
                                 ExtraArgs={'CacheControl': 'max-age=86400', 'ContentType': 'image/jpeg'})

    response = {}
    response['statusCode'] = 301
    response['headers'] = {'Location': f'https://{s3Url}/{imgUrlEnc}', 'Access-Control-Allow-Origin': '*'}
    data = {}
    response['body'] = json.dumps(data)
    return response


def download_img(buffer, url):
    resp = requests.get(url, stream=True)
    # TODO err handling
    if resp.status_code == 200:
        for chunk in resp:
            buffer.write(chunk)


def limit_img_size(buffer, target_filesize, tolerance=5, debug=False):
    img = img_orig = Image.open(buffer).convert('RGB')
    aspect = img.size[0] / img.size[1]

    if len(buffer.getvalue()) < (target_filesize + target_filesize * (tolerance / 100)):
        if (debug):
            print("size within tolerance. nothing to do.")
        return  # dont do anything if it's already good

    while True:
        buffer.seek(0)
        buffer.truncate(0)
        img.save(buffer, format="JPEG", optimize=True, quality=75)
        data = buffer.getvalue()
        filesize = len(data)
        size_deviation = filesize / target_filesize
        if (debug):
            print("size: {}; factor: {:.3f}".format(filesize, size_deviation))

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


def test():
    url = "https://media.wizards.com/2015/images/dnd/resources/Sword-Coast-Map_LowRes.jpg"
    with io.BytesIO() as buffer:
        download_img(buffer, url)
        print(f"original buffer size: {len(buffer.getvalue())}")
        with open("/tmp/download.jpg", "wb") as f:
            f.write(buffer.getvalue())
        limit_img_size(
            buffer,
            1048576,  # target image size
            tolerance=5,  # percent of what the file may be bigger than TARGET_BYTES
            debug=True
        )
        buffer.seek(0)
        print(f"final buffer size: {len(buffer.getvalue())}")
        with open("/tmp/temp.jpg", "wb") as f:
            f.write(buffer.getvalue())


if __name__ == '__main__':
    test()
