#!/usr/bin/env python3

import base64
import io
import json
import os
import warnings

from decimal import Decimal
import boto3
import short_url
import requests
from PIL import Image

warnings.simplefilter('error', Image.DecompressionBombWarning)


def lambda_handler(event, context):
    imgUrlEnc = event['pathParameters']['url']
    imgUrl = base64.b64decode(event['pathParameters']['url'])
    region = os.environ['AWS_REGION']
    bucket = os.environ['BUCKET']
    s3Url = os.environ['URL']
    tableName = os.environ['DYNAMODB_TABLE']
    s3_client = boto3.client('s3')
    dynamodb = boto3.resource('dynamodb', region_name=region)
    table = dynamodb.Table(tableName)

    with io.BytesIO() as buffer:
        download_img(buffer, imgUrl)
        token_resize(
            buffer,
            int(os.environ['TARGET_SIZE'])  # target image width and height
        )
        buffer.seek(0)  # rewind file pointer before read

        response = table.update_item(
            Key={'id': 'count'},
            UpdateExpression="set token_counter = token_counter + :val",
            ExpressionAttributeValues={
                ':val': Decimal(1)
            },
            ReturnValues="UPDATED_NEW"
        )
        number = int(response['Attributes']['token_counter'])  # this is the number we have to shorturl
        shortCode = short_url.encode_url(number)

        contents = f'<html><head><title>Token ID for {imgUrl.decode("utf-8")}</title><meta name="description" content="{shortCode}"></head><body>{shortCode}</body></html>'
        body = contents.encode()

        s3_client.put_object(Body=body, Bucket=bucket, Key=f'meta/{imgUrlEnc}',
                             CacheControl='max-age=3600', ContentType='text/html')

        s3_client.upload_fileobj(buffer, bucket, f'img/{shortCode}',
                                 ExtraArgs={'CacheControl': 'max-age=86400', 'ContentType': 'image/jpeg'})

    response = {}
    response['statusCode'] = 301
    response['headers'] = {'Location': f'https://{s3Url}/meta/{imgUrlEnc}'}
    data = {}
    response['body'] = json.dumps(data)
    return response


def download_img(buffer, url):
    resp = requests.get(url, stream=True)
    # TODO err handling
    if resp.status_code == 200:
        for chunk in resp:
            buffer.write(chunk)


def token_resize(buffer, size, debug=False):
    img = Image.open(buffer).convert('RGB')
    width, height = img.size

    # crop the image to a square, saving the center bits
    if width > height:
        img = img.crop(box=((width - height) / 2, 0, ((width - height) / 2) + height, height))
    elif width < height:
        img = img.crop(box=(0, (height - width) / 2, width, ((height - width) / 2) + width))

    # resize the image up or down to size x size
    img = img.resize((size, size))

    buffer.seek(0)
    buffer.truncate(0)
    img.save(buffer, format="JPEG", optimize=True, quality=75)


def test():
    taller = "https://i.pinimg.com/236x/8e/b3/30/8eb3305d2477ec223a8987a417bb1413.jpg"
    wider = "https://images-na.ssl-images-amazon.com/images/I/816aY1-FCFL._SX500_.jpg"
    trans = "https://i.imgur.com/3Gm6vW9.jpg"
    size = 160

    with io.BytesIO() as buffer:
        download_img(buffer, taller)
        print(f"original buffer size: {len(buffer.getvalue())}")
        with open("/tmp/taller.jpg", "wb") as f:
            f.write(buffer.getvalue())
        token_resize(
            buffer,
            size=size,
            debug=True
        )
        buffer.seek(0)
        print(f"final buffer size: {len(buffer.getvalue())}")
        with open("/tmp/taller.png", "wb") as f:
            f.write(buffer.getvalue())

    with io.BytesIO() as buffer:
        download_img(buffer, wider)
        print(f"original buffer size: {len(buffer.getvalue())}")
        with open("/tmp/wider.jpg", "wb") as f:
            f.write(buffer.getvalue())
        token_resize(
            buffer,
            size=size,
            debug=True
        )
        buffer.seek(0)
        print(f"final buffer size: {len(buffer.getvalue())}")
        with open("/tmp/wider.png", "wb") as f:
            f.write(buffer.getvalue())

    with io.BytesIO() as buffer:
        download_img(buffer, trans)
        print(f"original buffer size: {len(buffer.getvalue())}")
        with open("/tmp/trans.jpg", "wb") as f:
            f.write(buffer.getvalue())
        token_resize(
            buffer,
            size=size,
            debug=True
        )
        buffer.seek(0)
        print(f"final buffer size: {len(buffer.getvalue())}")
        with open("/tmp/trans.png", "wb") as f:
            f.write(buffer.getvalue())


if __name__ == '__main__':
    test()
