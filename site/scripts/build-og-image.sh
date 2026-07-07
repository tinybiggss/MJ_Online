#!/usr/bin/env bash
# Builds the Open Graph / social share card (1200x630) for mikejones.online.
# On-brand: near-black field-bg, amber signal accent, the B&W headshot the
# homepage uses. Re-run after changing the headshot or tagline.
#
# Requires ImageMagick (`brew install imagemagick`).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/public/img/headshot-bw.png"
OUT="$ROOT/public/img/og-default.png"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Brand tokens (from src/styles/global.css)
BG="#0a0a0b"
INK="#f4f2ee"
MUTED="#a3a09a"
SIGNAL="#f59433"
LINE="#262629"

DISPLAY="/System/Library/Fonts/Avenir Next.ttc"

# 1) Portrait crop of the headshot -> rounded panel with an amber hairline ring.
PW=470; PH=560; RAD=28
magick "$SRC" -resize ${PW}x${PH}^ -gravity center -extent ${PW}x${PH} "$TMP/crop.png"
# rounded-corner mask (white = keep, black = cut — used as the alpha channel)
magick -size ${PW}x${PH} xc:black -fill white -draw "roundrectangle 0,0,$((PW-1)),$((PH-1)),$RAD,$RAD" "$TMP/mask.png"
magick "$TMP/crop.png" "$TMP/mask.png" -alpha off -compose CopyOpacity -composite "$TMP/panel.png"

# 2) Base canvas + a slim amber accent bar down the left edge.
magick -size 1200x630 xc:"$BG" \
  -fill "$SIGNAL" -draw "rectangle 0,0 10,630" \
  "$TMP/base.png"

# 3) Composite the headshot panel on the right.
magick "$TMP/base.png" "$TMP/panel.png" -gravity East -geometry +80+0 -composite "$TMP/withimg.png"

# 4) Text block on the left.
magick "$TMP/withimg.png" \
  -font "$DISPLAY" \
  -fill "$SIGNAL" -pointsize 26 -kerning 3 \
  -gravity NorthWest -annotate +80+96 "AI IMPLEMENTATION EXPERT" \
  -fill "$INK" -pointsize 82 -kerning -1 \
  -annotate +78+150 "AI that holds up" \
  -annotate +78+248 "under load." \
  -fill "$MUTED" -pointsize 30 -kerning 0 \
  -annotate +80+380 "Mike Jones — 29 years building" \
  -annotate +80+420 "systems that ship." \
  -fill "$SIGNAL" -pointsize 26 -kerning 1 \
  -gravity SouthWest -annotate +80+70 "mikejones.online" \
  "$OUT"

echo "Wrote $OUT"
magick identify "$OUT"
