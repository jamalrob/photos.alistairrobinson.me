# photos.alistairrobinson.me

Source for my personal photo portfolio. Images are stored and served via ImageKit CDN.

## How it works

Image metadata is fetched from the ImageKit API at build time and rendered into a static site by a Python script, then rsynced to a VPS.

```
ImageKit API  →  build.py  →  out/  →  make deploy  →  server
```

## Commands

| Command | What it does |
|---|---|
| `make build` | Build the site into `out/` |
| `make deploy` | Build and rsync `out/` to the server |

## Deployment

The site runs on a VPS at `178.128.32.180`, served by nginx. Server details are in `.env` (not committed).

To publish new photos, upload them to ImageKit and then:

```bash
make deploy
```

## Images

Photos are stored in the root folder of the ImageKit account at `https://ik.imagekit.io/alistairrobinson`. Each image should have the following custom metadata fields set in ImageKit:

| Field | Description |
|---|---|
| `description` | Caption / title of the photo |
| `camera_type` | e.g. `Film`, `Digital` |
| `camera` | e.g. `Fujifilm X-70`, `Holga 120N` |
| `friendly_date` | e.g. `2017/2018` |
