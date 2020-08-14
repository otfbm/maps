#!/usr/bin/env python3

import warnings
from PIL import Image
import io
from hashlib import sha256
import requests

warnings.simplefilter('error', Image.DecompressionBombWarning)

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
        print("size: {}; factor: {:.3f}".format(filesize, size_deviation))
        return

        if size_deviation <= (100 + tolerance) / 100:
            # filesize fits
            return
        else:
            # filesize not good enough => adapt width and height
            # use sqrt of deviation since applied both in width and height
            new_width = img.size[0] / size_deviation**0.5
            new_height = new_width / aspect
            # resize from img_orig to not lose quality
            img = img_orig.resize((int(new_width), int(new_height)))

url = 'http://media.wizards.com/2015/images/dnd/resources/Sword-Coast-Map_HighRes.jpg'
with io.BytesIO() as buffer:
    download_img(buffer, url)

    limit_img_size(
        buffer,
        1048576,   # bytes
        tolerance = 5    # percent of what the file may be bigger than target_filesize
    )

    hash = sha256(url.encode('utf-8')).hexdigest()
    with open(f'{hash}.jpg', "wb") as f:
        f.write(buffer.getvalue())