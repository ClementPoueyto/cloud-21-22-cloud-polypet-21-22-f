#!/bin/bash

for line in $(find . -type d -name "polypet-*"); do
	echo "[$line] Installing packages"
	cd "$line"
	npm install
	cd ..
	echo "[$line] Done"
done
echo "[Cli] Installing packages"
cd ./cli
pip install -r requirements.txt
cd ../
echo "[Cli] done"
