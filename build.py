#!/usr/bin/env python3
"""Static site builder for photos.alistairrobinson.me"""

import os
import shutil
from pathlib import Path

import requests
from jinja2 import Environment, FileSystemLoader

# --- Settings ---

OUT_DIR       = Path('out')
STATIC_DIR    = Path('static')
TEMPLATES_DIR = Path('templates')
PUBLIC_DIR    = Path('public')

IMAGEKIT_PRIVATE_KEY  = os.environ['IMAGEKIT_PRIVATE_KEY']
IMAGEKIT_URL_ENDPOINT = os.environ['IMAGEKIT_URL_ENDPOINT'].rstrip('/')

SITE_TITLE = 'Photographs by Alistair Robinson'

# Files with known issues on ImageKit (corrupted uploads etc.)
SKIP_SLUGS = {
    'maslenitsa-festival-nikola-lenivets-7',
}

THUMB_WIDTH   = 600
THUMB_QUALITY = 70
FULL_QUALITY  = 86
FULL_WIDTH    = 1200
SQUARE_WIDTH  = 760

# --- Helpers ---

def ik_url(filename, width, quality):
    name = filename.replace(' ', '%20')
    return f"{IMAGEKIT_URL_ENDPOINT}/tr:w-{width},q-{quality}/{name}"


def list_images():
    resp = requests.get(
        'https://api.imagekit.io/v1/files',
        params={'sort': 'ASC_NAME', 'path': '/'},
        auth=(IMAGEKIT_PRIVATE_KEY, ''),
    )
    resp.raise_for_status()
    return resp.json()


def to_slug(filename):
    return filename[:filename.rfind('.')]


def is_square(image):
    return abs(image.get('width', 0) - image.get('height', 0)) < 100


def write_page(rel_path, content):
    p = OUT_DIR / rel_path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding='utf-8')
    print(f'  {rel_path}')


# --- Build ---

def build():
    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    OUT_DIR.mkdir()

    env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)), autoescape=True)
    env.globals['site_title'] = SITE_TITLE

    # Copy static assets
    if STATIC_DIR.exists():
        shutil.copytree(STATIC_DIR, OUT_DIR / 'static')
    if PUBLIC_DIR.exists():
        for item in PUBLIC_DIR.iterdir():
            dst = OUT_DIR / item.name
            (shutil.copytree if item.is_dir() else shutil.copy2)(item, dst)

    print('Fetching image list from ImageKit...')
    raw_images = list_images()
    print(f'Found {len(raw_images)} images.')

    images = []
    for im in raw_images:
        if to_slug(im['name']) in SKIP_SLUGS:
            continue
        meta = im.get('customMetadata') or {}
        full_width = SQUARE_WIDTH if is_square(im) else FULL_WIDTH
        file_path = im['filePath'].lstrip('/')
        images.append({
            'slug':         to_slug(im['name']),
            'name':         im['name'],
            'thumb_url':    ik_url(file_path, THUMB_WIDTH, THUMB_QUALITY),
            'full_url':     ik_url(file_path, full_width, FULL_QUALITY),
            'description':  meta.get('description', ''),
            'camera_type':  meta.get('camera_type', ''),
            'camera':       meta.get('camera', ''),
            'friendly_date': meta.get('friendly_date', ''),
        })

    # Index
    print('index')
    write_page('index.html', env.get_template('index.html').render(images=images))

    # Photo pages
    print('photos')
    for i, im in enumerate(images):
        write_page(
            f"{im['slug']}/index.html",
            env.get_template('photo.html').render(
                image      = im,
                prev_image = images[i - 1] if i > 0 else None,
                next_image = images[i + 1] if i < len(images) - 1 else None,
            )
        )

    # About
    print('about')
    write_page('about/index.html', env.get_template('about.html').render())

    print(f'\nDone: {len(images)} photos.')


if __name__ == '__main__':
    build()
