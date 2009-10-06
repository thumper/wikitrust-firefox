
.PHONY: wikitrust.xpi clean build builddir


wikitrust.xpi: build
	rm -f wikitrust.xpi
	cd build; zip -r ../wikitrust.xpi  chrome.manifest chrome install.rdf

build:
	mkdir -p build
	rsync -av src/ build/
	rm build/chrome/content/wikitrust.js
	java -jar bin/yuicompressor-2.4.2.jar -v --charset utf8 -o build/chrome/content/wikitrust.js src/chrome/content/wikitrust.js

clean:
	rm -rf build wikitrust.xpi


