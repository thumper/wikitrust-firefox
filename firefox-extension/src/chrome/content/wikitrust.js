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

    function getArticleFromUrl(prev, loc) {
	var match = /^\/wiki\/(.*)$/.exec(loc.pathname);
	if (match != null) return match[1];
	if (loc.pathname == "/w/index.php") {
	    match = /title=([^&]+)/.exec(loc.search);
	    if (match != null) return match[1];
	}
	return prev;
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

	var anchor = findChild(mainTab, "A");
	var article = getArticleFromUrl(null, page.location);
	log("article1 = [" + article + "]");
	var betterloc = {
	    pathname: anchor.getAttribute("href"),
	};
	article = getArticleFromUrl(article, betterloc);
	log("article2 = [" + article + "]");

	// And modify page to display "check trust" tab
	var li_snippet = page.createElement('li');
	li_snippet.setAttribute("id", "ca-trust");
	li_snippet.innerHTML = '<a href="http://wiki-trust.cse.ucsc.edu/index.php/'
	    + article + '" title="Trust colored version of this page">'
	    + 'trust info</a>';

	var ul = mainTab.parentNode;
	ul.appendChild(li_snippet);
    }

    window.addEventListener("load", function(e) {
	document.getElementById("appcontent").addEventListener(
		"DOMContentLoaded", maybeAddTrust, false);
    }, false);
})();
