
.PHONY: wikitrust.xpi clean


wikitrust.xpi:
	rm -f wikitrust.xpi
	cd src; zip -r ../wikitrust.xpi  chrome.manifest chrome install.rdf

clean:
	rm -rf wikitrust.xpi


