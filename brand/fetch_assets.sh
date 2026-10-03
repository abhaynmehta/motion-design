#!/usr/bin/env bash
# Run from repo root: bash brand/fetch_assets.sh
set -e
mkdir -p brand/assets/{logo,product,lifestyle,infographics,press,video}
dl(){ curl -fsSL "$1" -o "$2" && echo "ok  $2" || echo "FAIL $1"; }
S=https://cdn.shopify.com/s/files/1/0879/6490/9833/files
D=https://www.drinksult.com/cdn/shop/files

# Logos
dl $D/sult_logo_Dark-large.png brand/assets/logo/sult_logo_dark.png
dl $D/sult_logo_dark-large_3.png brand/assets/logo/sult_logo_dark_alt.png
dl $D/SULT_LOGO_7041cada-ee2c-47db-bc15-a8262880d190.png brand/assets/logo/sult_logo_og_2000x713.png

# Product packshots
dl $S/Sult_Ecom3_Nov25_1417_Product_Shots_Peach_Citurs_45_degree_sachet.jpg brand/assets/product/peach_citrus_box_sachet.jpg
dl $S/Sult_Ecom3_Nov25_1426_ProductShots_SultyBundle.jpg brand/assets/product/sulty_bundle.jpg
dl $S/Sult_Ecom3_Nov25_1426_Product_Shots_Sulty_Bundle.jpg brand/assets/product/sulty_bundle_alt.jpg
dl $S/SULT_PDP_Box_Altered_Mix_Pack_15_uncropped_sachet.jpg brand/assets/product/variety_15.jpg
dl $S/Sult_Ecom3_Nov25_1410_ProductShots_MixPack30_45degree.jpg brand/assets/product/variety_30.jpg
dl $S/Sult_Ecom3_Nov25_1434_ProductShots_30Miz_bottle.jpg brand/assets/product/variety_30_bottle.jpg
dl $D/Sult_Ecom3_Nov25_1424_Product_Shots_Black_Friday_Hero_Sachets.jpg brand/assets/product/hero_sachets.jpg
dl $S/Sult_Ecom3_Nov25_1464_Product_Shots_All_Bottles.jpg brand/assets/product/all_bottles.jpg
dl $S/BOTTLE.png brand/assets/product/bottle_500ml.png
dl $S/SULT_ECOM_JUNE_98_WaterBottle.png brand/assets/product/bottle_tall_cutout.png
dl $S/SULT_ECOM_JUNE_100_Water_Bottle.jpg brand/assets/product/bottle_500ml_2.jpg
dl $S/sult_clear_bottle.jpg brand/assets/product/squeezy_translucent.jpg
dl $S/blue_bottle_squeezy_sky_background.jpg brand/assets/product/squeezy_blue_sky.jpg
dl $S/yellow_squuezy_bottle_sky_background_op2.jpg brand/assets/product/squeezy_yellow_sky.jpg
dl $S/SULT_BOTTLE_ECOM_sky_comp_bottle_1.jpg brand/assets/product/biggie_1.jpg
dl $S/SULT_BOTTLE_ECOM_sky_comp_square.jpg brand/assets/product/biggie_square.jpg
for t in EVERYDAY EVENING TRAVEL WORKOUT COLLECTION_PORTRAIT; do dl "$S/SULT_TIN_-_${t}_WITH_TEXT.jpg" "brand/assets/product/tinny_${t,,}.jpg"; done

# Lifestyle / portraits
dl $S/Sult_Ecom3_Nov25_622_Milly_R_Lily_1500.jpg brand/assets/lifestyle/squeezy_lifestyle.jpg
dl $D/SULT_ECOM_182_Freeman_copy.jpg brand/assets/lifestyle/portrait_freeman.jpg
dl $D/SULT_ECOM_91_Yaz_cffa50c6-da8f-42dd-985b-c6bec2e449c7.jpg brand/assets/lifestyle/portrait_yaz.jpg
dl $D/SULT_ECOM_492_Ellen_8431be09-383c-421d-9b31-7de3c3283872.jpg brand/assets/lifestyle/portrait_ellen.jpg
dl $D/SULT_ECOM_391_Omac_2_6a29ecea-b02c-4b8c-87f4-ce51e0af36b2.jpg brand/assets/lifestyle/portrait_omac.jpg
dl $S/SULT_ECOM_841_Products.jpg brand/assets/lifestyle/products_flatlay.jpg
dl $S/PHOTO-2025-11-17-16-45-58.jpg brand/assets/lifestyle/bottle_candid.jpg

# Infographics / ad statics (great reference for motion versions)
for f in FLAVOUR_COLOURS_6ffc789b-59e0-4c89-82a7-46dedfd5ce77 us_vs_them_v4 WHEN_TO_TAKE_V3 Bottle_info_graphic PACK_OPTIONS POP_MIX_PACK SUBSCRIBE_AND_SAVE_SINGLE SUBSCRIBE_AND_SAVE_VARIETY AS_SEEN_IN reviews Artboard_1 Artboard_4 Artboard_5-1 Artboard_1_18a6d654-ed42-404a-a0e7-9bd19c133538 Artboard_4_99cb85a0-ce24-48d0-9e70-6c0cb7e17130 Artboard_5-1_5e6c904b-650b-4343-942f-8419ed4fd009; do dl "$S/$f.jpg" "brand/assets/infographics/$f.jpg"; done
for f in BUNDLE_ADS_JUNE_8 Artboard_3 Artboard_2_1 Artboard_5 Artboard_7; do dl "$S/$f.png" "brand/assets/infographics/$f.png"; done

# Press logos
dl $D/vouge_logo.png brand/assets/press/vogue.png
dl $D/british-vogue-seeklogo.png brand/assets/press/british_vogue.png
dl $D/bo855b97f-boots-uk-logo-boots-company-liblogo.png brand/assets/press/boots.png
dl $D/Dazed_idXgV4Bl1g_0.png brand/assets/press/dazed.png

# Homepage UGC videos (vertical, 1080p) — reference only
for id in a399d6cd5f334710826bdb08ab417833:HD-1080p-2.5Mbps-67027800 e19df4b4eef24491b53c96c04576cd48:HD-1080p-7.2Mbps-70759368 62709e68ed84451ab46c93022d94c15e:HD-1080p-2.5Mbps-67028205 f8657ae912964c688855fe4583743d4e:HD-1080p-2.5Mbps-67028045 9142a89596a14c1c919d3ca87b53ac1c:HD-1080p-2.5Mbps-67028348 fffa4a2682744432a33de8cc83825cb0:HD-720p-1.6Mbps-70776256 4068ac2ac63d41dfa54e385064fa15da:HD-1080p-2.5Mbps-67028349 55d6da09c4434c5287c0aa5c39ae6998:HD-1080p-2.5Mbps-67027901 120e08c81b5a4d27af3be69aefb14901:HD-1080p-7.2Mbps-70777150; do
  h=${id%%:*}; q=${id#*:}; dl "https://www.drinksult.com/cdn/shop/videos/c/vp/$h/$h.$q.mp4" "brand/assets/video/ugc_$h.mp4"
done
