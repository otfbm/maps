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
import face_recognition
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

    # create a token with a naive crop to target_size
    with io.BytesIO() as buffer:
        download_img(buffer, imgUrl)
        token_resize(
            buffer,
            int(os.environ['TARGET_SIZE']))  # target image width and height
        buffer.seek(0)  # rewind file pointer before read

        s3_client.upload_fileobj(buffer, bucket, f'img/{shortCode}',
                                 ExtraArgs={'CacheControl': 'max-age=86400', 'ContentType': 'image/jpeg'})

    # create a token with scaling
    with io.BytesIO() as buffer:
        download_img(buffer, imgUrl)
        token_resize(
            buffer,
            size=int(os.environ['TARGET_SIZE']),  # target image width and height
            scale=2)
        buffer.seek(0)  # rewind file pointer before read

        s3_client.upload_fileobj(buffer, bucket, f'zoom/{shortCode}',
                                 ExtraArgs={'CacheControl': 'max-age=86400', 'ContentType': 'image/jpeg'})

    # attempt to create a token with face recognition
    with io.BytesIO() as buffer:
        download_img(buffer, imgUrl)
        found = token_resize_face(
            buffer,
            size=int(os.environ['TARGET_SIZE']),  # target image width and height
            padding=0.2
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


def token_resize(buffer, size, scale=1, debug=False):
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


def token_resize_face(buffer, size, padding, debug=False):
    face_image = face_recognition.load_image_file(buffer)
    face_locations = []

    if len(face_locations) == 0:
        if debug:
            print("Trying HOG..")
        face_locations = face_recognition.face_locations(face_image, number_of_times_to_upsample=0)

    if len(face_locations) == 0:
        if debug:
            print("Trying upsampled HOG..")
        face_locations = face_recognition.face_locations(face_image, number_of_times_to_upsample=1)

    if len(face_locations) == 0:
        if debug:
            print("Trying CNN..")
        face_locations = face_recognition.face_locations(face_image, number_of_times_to_upsample=0, model="cnn")

    if len(face_locations) == 0:
        if debug:
            print("Trying upsampled CNN..")
        face_locations = face_recognition.face_locations(face_image, number_of_times_to_upsample=1, model="cnn")

    if debug:
        print(f"Found {len(face_locations)} face(s).")

    if len(face_locations) == 0:
        # no faces to work on :'(
        buffer.seek(0)
        buffer.truncate(0)
        return False

    # find the largest face
    largest_face = None
    for face in face_locations:
        if largest_face is None:
            largest_face = face
        else:
            face_top, face_right, face_bottom, face_left = face
            largest_top, largest_right, largest_bottom, largest_left = largest_face
            if ((face_right - face_left) * (face_bottom - face_top)) > (
                    (largest_right - largest_left) * (largest_bottom - largest_top)):
                largest_face = face

    # try to "zoom" out by 20%
    face_top, face_right, face_bottom, face_left = largest_face
    face_width = face_right - face_left
    face_height = face_bottom - face_top

    buffer.seek(0)
    img = Image.open(buffer).convert('RGB')  # still convert the color space

    width, height = img.size
    new_left = max(face_left - (face_width * padding), 0)
    new_right = min(face_right + face_width * padding, width)
    new_top = max(face_top - face_height * padding, 0)
    new_bottom = min(face_bottom + face_height * padding, height)

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
        ("orc", "https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/301/1000/1000/636252771691385727.jpeg"),
        ("goblin", "https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/351/218/315/636252777818652432.jpeg"),
        ("silver_dragon", "https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/143/243/315/636252757538355953.jpeg"),
        ("skeleton", "https://media-waterdeep.cursecdn.com/avatars/thumbnails/16/472/1000/1000/636376294573239565.jpeg"),
        ("zombie", "https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/71/1000/1000/636252733510786769.jpeg"),
        ("ghost", "https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/413/1000/1000/636252786639798307.jpeg"),
        ("ghast", "https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/411/1000/1000/636252786516023032.jpeg"),
        ("mimic", "https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/211/1000/1000/636252764731637373.jpeg")
    ]
    size = 160

    for image in images:
        print(f"Working on {image[0]}")
        with io.BytesIO() as buffer:
            download_img(buffer, image[1])
            buffer.seek(0)
            with open(f"/tmp/{image[0]}.jpg", "wb") as f:
                f.write(buffer.getvalue())
                buffer.seek(0)
            token_resize(
                buffer,
                size=size,
                debug=True
            )
            buffer.seek(0)
            with open(f"/tmp/{image[0]}_token.jpg", "wb") as f:
                f.write(buffer.getvalue())

        with io.BytesIO() as buffer:
            download_img(buffer, image[1])
            buffer.seek(0)
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
