#!/usr/bin/env bash
# Converts all pngs in directory to square images with a bg of #f9f9f9, good for posting to instagram

for pic in ./*.png; do                                                                                  (main)  
convert -background "#f9f9f9" -gravity center "$pic" -resize 1080x1080 -extent 1080x1080 "${pic%.*}.insta.png";
done
