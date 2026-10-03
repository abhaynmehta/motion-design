#!/bin/sh
# Fetch everything this film is cut from (none of it is committed: client footage, licensed brand fonts, raw brand photos).
# Run from the project root:  sh scripts/fetch_sources.sh && sh scripts/prep_frames.sh && python3 scripts/prep_photos.py && python3 scripts/prep_logo.py
set -e
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36"
mkdir -p source assets/fonts assets/photo research/logo

# 1. the three Kay Beauty launch reels (Google Drive folder "Inspo", shared by the client)
#    A Hydra Base Water Crème · B Hydra Cloud Cushion Foundation · C Hydra Luscious Gloss Stain
for pair in A:1oD_USSOkKQl8vi2QQW1q1qsELmwcGFd3 B:1k4Hdk1eh_N1Y_i0GS68FISoBfhGFL_LX C:1CYbaUNx85u7YBmQbgo_o00rb8ru6aqvr; do
  k=${pair%%:*}; id=${pair#*:}
  curl -sSL -o "source/$k.mp4" "https://drive.usercontent.google.com/download?id=$id&export=download&confirm=t"
done

# 2. Kay Beauty's own faces from kaybeauty.com: Miegha (display) and Nesans (UI)
curl -sS -A "$UA" -o assets/fonts/Miegha.woff2 "https://cdn.shopify.com/s/files/1/0636/7782/5262/files/Miegha.woff2?v=1674189806"
curl -sS -A "$UA" -o assets/fonts/Miegha-Italic.woff2 "https://cdn.shopify.com/s/files/1/0636/7782/5262/files/Miegha-Italic.woff2?v=1674189806"
curl -sS -A "$UA" -o assets/fonts/nesans-700.woff2 "https://cdn.shopify.com/s/files/1/0902/1289/2955/files/NesansBold.ttf?v=1753084791"
curl -sS -A "$UA" -o assets/fonts/nesans-600.woff2 "https://cdn.shopify.com/s/files/1/0902/1289/2955/files/Nesans_Semi_Bold_600.ttf?v=1753799659"

# 3. the official logo (the site serves it at 141 px; prep_logo.py rebuilds a clean matte at 8x)
curl -sS -A "$UA" -o research/logo/kay-logo_2.png "https://www.kaybeauty.com/cdn/shop/files/kay-logo_2.png?v=1747738312"

# 4. product data + campaign photos from the brand's own product pages
for h in kay-beauty-hydrabase-water-creme kay-beauty-hydra-cloud-cushion-foundation hydra-luscious-lip-tint; do
  curl -sS -A "$UA" -o "research/$h.json" "https://www.kaybeauty.com/products/$h.json"
done
python3 - <<'PY'
import json, subprocess
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36"
sel = {'kay-beauty-hydrabase-water-creme': {2: 'creme_katrina_face', 4: 'creme_katrina_jar'},
       'hydra-luscious-lip-tint': {17: 'lip_trio_katrina', 18: 'lip_glossy_finish', 22: 'lip_swatches',
                                   **{i: f'lip_s{i}' for i in range(8)}},
       'kay-beauty-hydra-cloud-cushion-foundation': {0: 'cushion_packshot'}}
for h, m in sel.items():
    ims = json.load(open(f'research/{h}.json'))['product']['images']
    for i, name in m.items():
        subprocess.run(['curl', '-sS', '-A', UA, '-o', f'assets/photo/{name}.jpg', ims[i]['src']], check=True)
print('photos fetched')
PY
echo "sources fetched"
