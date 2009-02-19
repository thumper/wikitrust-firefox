(function() {
    const hostname = "wikipedia.org";

    var aConsoleService = Components.classes["@mozilla.org/consoleservice;1"].
		getService(Components.interfaces.nsIConsoleService);

    function log(str) {
	var now = new Date();
	aConsoleService.logStringMessage("wikitrust: "
		+ now.getTime() + ": " + str);
    }

    function getWikiLang(loc) {
	try {
	    var dom = loc.host.indexOf('.wikipedia.org');
	    if (dom < 0) return null;
	    else return loc.host.substr(0, dom);
	} catch (e) {
	    return null;
	}
    }

    var baseURL = "http://wiki-trust.cse.ucsc.edu/index.php";

    function getTrustURL(loc) {
	var match = /^\/wiki\/(.*)$/.exec(loc.pathname);
	if (match != null) return baseURL + "/" + match[1];
	if (loc.pathname == "/w/index.php") return baseURL + loc.search;
	return null;
    }

    function findChild(root, name) {
	var children = root.childNodes;
	for (var i=0; i<children.length; i++) {
	    var node = children[i];
	    if (node.nodeType == 1 && node.nodeName == name)
		return node;
	}
	return null;
    }

    function maybeAddTrust(ev) {
	var page = ev.originalTarget;
	if (page.nodeName != "#document") return;
	if (!page.location) return;

	log("testing location: " + page.location);
	var lang = getWikiLang(page.location);
	if (!lang) return;
	log("lang = " + lang);

	var mainTab = page.getElementById('ca-nstab-main');
	if (!mainTab) return;		// must not be a main article!
	if (mainTab.getAttribute("class") != "selected") return;

	var articleURL = getTrustURL(page.location);

	// And modify page to display "check trust" tab
	var li_snippet = page.createElement('li');
	li_snippet.setAttribute("id", "ca-trust");
	li_snippet.innerHTML = '<a href="'
	    + articleURL + '" title="Trust colored version of this page">'
	    + 'trust info</a>';

	var ul = mainTab.parentNode;
	ul.appendChild(li_snippet);
    }

    window.addEventListener("load", function(e) {
	document.getElementById("appcontent").addEventListener(
		"DOMContentLoaded", maybeAddTrust, false);
    }, false);
})();
