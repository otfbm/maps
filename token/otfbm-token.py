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

    # get new shortcode
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

    with io.BytesIO() as orig_buffer:
        download_img(orig_buffer, imgUrl)
        convert_alpha(orig_buffer)

        # create a token with a naive crop to target_size
        with io.BytesIO() as buffer:
            copy_buf_to_buf(orig_buffer, buffer)
            token_resize(
                buffer,
                int(os.environ['TARGET_SIZE']))  # target image width and height
            buffer.seek(0)  # rewind file pointer before read

            s3_client.upload_fileobj(buffer, bucket, f'img/{shortCode}',
                                     ExtraArgs={'CacheControl': 'max-age=86400', 'ContentType': 'image/jpeg'})

        # create a token with scaling
        with io.BytesIO() as buffer:
            copy_buf_to_buf(orig_buffer, buffer)
            token_resize(
                buffer,
                size=int(os.environ['TARGET_SIZE']),  # target image width and height
                zoom=float(os.environ['ZOOM_LEVEL']))
            buffer.seek(0)  # rewind file pointer before read

            s3_client.upload_fileobj(buffer, bucket, f'zoom/{shortCode}',
                                     ExtraArgs={'CacheControl': 'max-age=86400', 'ContentType': 'image/jpeg'})

        # attempt to create a token with face recognition
        with io.BytesIO() as buffer:
            copy_buf_to_buf(orig_buffer, buffer)
            found = token_resize_face(
                buffer,
                size=int(os.environ['TARGET_SIZE']),  # target image width and height
                padding=float(os.environ['FACE_RECOGNITION_PADDING'])
            )
            buffer.seek(0)  # rewind file pointer before read

            if found:
                s3_client.upload_fileobj(buffer, bucket, f'face/{shortCode}',
                                         ExtraArgs={'CacheControl': 'max-age=86400', 'ContentType': 'image/jpeg'})

        # write the metadata
        contents = f'<html><head><title>Token ID for {imgUrl.decode("utf-8")}</title><meta name="description" content="Token short code -> {shortCode}"></head><body>{shortCode}</body></html>'
        body = contents.encode()

        s3_client.put_object(Body=body, Bucket=bucket, Key=f'meta/{imgUrlEnc}',
                             CacheControl='max-age=3600', ContentType='text/html')

    response = {'statusCode': 301, 'headers': {'Location': f'https://{s3Url}/meta/{imgUrlEnc}'}}
    data = {}
    response['body'] = json.dumps(data)
    return response


def copy_buf_to_buf(src, dst, bufsize=16384):
    src.seek(0)
    while True:
        buf = src.read(bufsize)
        if not buf:
            break
        dst.write(buf)
    dst.seek(0)


def convert_alpha(buffer):
    rgba = Image.open(buffer)
    if len(rgba.split()) > 3:
        rgba.load()
        image = Image.new("RGB", rgba.size, "WHITE")
        image.paste(rgba, mask=rgba.split()[3])
        buffer.seek(0)
        buffer.truncate(0)
        image.save(buffer, "JPEG", quality=100)


def download_img(buffer, url):
    resp = requests.get(url, stream=True)
    # TODO err handling
    if resp.status_code == 200:
        for chunk in resp:
            buffer.write(chunk)


def zoom_at(img, x, y, zoom):
    w, h = img.size
    zoom2 = zoom * 2
    img = img.crop((x - w / zoom2, y - h / zoom2,
                    x + w / zoom2, y + h / zoom2))
    return img.resize((w, h), Image.LANCZOS)


def token_resize(buffer, size, zoom=1.0, debug=False):
    img = Image.open(buffer).convert('RGB')
    width, height = img.size

    # crop the image to a square, saving the center bits
    if width > height:  # landscape
        if zoom != 1:
            img = zoom_at(img, width * 0.5, height * 0.5, zoom)
        img = img.crop(box=((width - height) / 2, 0, ((width - height) / 2) + height, height))
    elif width < height:  # portrait, let's assume the interesting section will be toward the top
        if zoom != 1:
            img = zoom_at(img, width * 0.5, height * 0.3, zoom)
        img = img.crop(box=(0, (height - width) / 2, width, ((height - width) / 2) + width))

    # resize the image up or down to size x size
    img = img.resize((size, size))

    buffer.seek(0)
    buffer.truncate(0)
    img.save(buffer, format="JPEG", optimize=True, quality=75)


def token_resize_face(buffer, size, padding, debug=False):
    client = boto3.client('rekognition')
    response = client.detect_faces(Attributes=["DEFAULT"], Image={'Bytes': buffer.read()})

    if debug:
        print(f"Found {len(response['FaceDetails'])} face(s).")

    if len(response['FaceDetails']) == 0:
        # no faces to work on :'(
        # opportunity to farm this out here
        buffer.seek(0)
        buffer.truncate(0)
        return False

    # get the biggest face in the image
    largest_face = {}
    largest_area = 0
    for faceDetail in response['FaceDetails']:
        bb = faceDetail["BoundingBox"]
        area = bb["Height"] * bb["Width"]
        if debug:
            print(f"Face Bounding Box: {bb}")
            print(f"Face Area: {area}")
        if area > largest_area:
            largest_area = area
            largest_face = faceDetail

    buffer.seek(0)
    img = Image.open(buffer).convert('RGB')  # still convert the color space
    width, height = img.size

    print(largest_face)
    # largest_face.BoundingBox elements are expressed as a ratio
    bb = largest_face["BoundingBox"]
    face_top = bb["Top"] * height
    face_bottom = (bb["Top"] * height) + (bb["Height"] * height)
    face_left = bb["Left"] * width
    face_right = (bb["Left"] * width) + (bb["Width"] * width)
    face_width = face_right - face_left
    face_height = face_bottom - face_top

    new_left = max(face_left - (face_width * padding), 0)
    new_right = min(face_right + face_width * padding, width)
    new_top = max(face_top - face_height * padding, 0)
    new_bottom = min(face_bottom + face_height * padding, height)

    new_height = new_bottom - new_top
    new_width = new_right - new_left

    if new_height > new_width:  # portrait
        diff = new_height - new_width
        new_left = max(new_left - diff / 2, 0)
        new_right = min(new_right + diff / 2, width)
    elif new_width > new_height:  # landscape
        diff = new_width - new_height
        new_top = max(new_top - diff / 2, 0)
        new_bottom = min(new_bottom + diff / 2, 0)

    if debug:
        print(f"height,width=({height}, {width})")
        print(f"face(height,width)=({face_height}, {face_width})")
        print(f"face(left,top,right,bottom)=({face_left},{face_top},{face_right},{face_bottom})")
        print(f"crop(left,top,right,bottom)=({new_left},{new_top},{new_right},{new_bottom})")

    # Pillow's crop takes a box of tuple(left, upper, right, lower)
    img = img.crop(box=(new_left, new_top, new_right, new_bottom))

    # resize the image up or down to size x size
    img = img.resize((size, size))

    buffer.seek(0)
    buffer.truncate(0)
    img.save(buffer, format="JPEG", optimize=True, quality=75)
    return True


def test():
    images = [
        ("frog", "https://i.imgur.com/CQHKccM.png"),
        (
            "skeleton",
            "https://media-waterdeep.cursecdn.com/avatars/thumbnails/16/472/1000/1000/636376294573239565.jpeg"),
        ("zombie", "https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/71/1000/1000/636252733510786769.jpeg"),
        ("ghost", "https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/413/1000/1000/636252786639798307.jpeg"),
        ("ghast", "https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/411/1000/1000/636252786516023032.jpeg")
    ]
    size = 160

    for image in images:
        print(f"Working on {image[0]}")
        with io.BytesIO() as orig_buffer:
            download_img(orig_buffer, image[1])
            convert_alpha(orig_buffer)
            with open(f"/tmp/{image[0]}.jpg", "wb") as f:
                f.write(orig_buffer.getvalue())

            with io.BytesIO() as buffer:
                copy_buf_to_buf(orig_buffer, buffer)
                token_resize(
                    buffer,
                    size=size,
                    debug=True
                )
                buffer.seek(0)
                with open(f"/tmp/{image[0]}_token.jpg", "wb") as f:
                    f.write(buffer.getvalue())

            with io.BytesIO() as buffer:
                copy_buf_to_buf(orig_buffer, buffer)
                token_resize(
                    buffer,
                    size=size,
                    zoom=1.7,
                    debug=True
                )
                buffer.seek(0)
                with open(f"/tmp/{image[0]}_token_scaled.jpg", "wb") as f:
                    f.write(buffer.getvalue())

            with io.BytesIO() as buffer:
                copy_buf_to_buf(orig_buffer, buffer)
                token_resize_face(
                    buffer,
                    size=size,
                    padding=0.2,
                    debug=True
                )
                buffer.seek(0)
                with open(f"/tmp/{image[0]}_token_face.jpg", "wb") as f:
                    f.write(buffer.getvalue())


if __name__ == '__main__':
    test()
