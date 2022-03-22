#!/bin/bash

for line in $(find . -type d -name "polypet-*"); do
	echo "[$line] building apps"
	cd "$line"
	npm run build
	cd ..
	echo "[$line] Done"
done
