rm -f public/icon/*
for size in 16 32 48 96 128; do
	convert -background none -resize ${size}x${size} assets/logo.svg public/icon/${size}.png
done
