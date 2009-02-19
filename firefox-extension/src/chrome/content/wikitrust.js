(function() {
    const hostname = "wikipedia.org";

    var aConsoleService = Components.classes["@mozilla.org/consoleservice;1"].
		getService(Components.interfaces.nsIConsoleService);

    function log(str) {
	var now = new Date();
	aConsoleService.logStringMessage("wikitrust: "
		+ now.getTime() + ": " + str);
    }

    var namespaces = {
	'User' : true,
	'Wikipedia' : true,
	'Image' : true,
	'Talk' : true,
	'User_talk' : true,
	'Wikipedia_talk' : true,
	'Image_talk' : true,
	'Mediawiki' : true,
	'Special' : true
    };

    function getWikiLang(loc) {
	try {
	    var dom = loc.host.indexOf('.wikipedia.org');
	    if (dom < 0) return null;
	    else return loc.host.substr(0, dom);
	} catch (e) {
	    return null;
	}
    }

    function getArticleFromUrl(loc) {
	var match = /^\/wiki\/(.*)$/.exec(loc.pathname);
	if (match != null) return match[1];
	if (loc.pathname == "/w/index.php") {
	    match = /title=([^&]+)/.exec(loc.search);
	    if (match != null) return match[1];
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

	var article = getArticleFromUrl(page.location);
	log("article = [" + article + "]");

	// And modify page to display "check trust" tab
	var css_snippet = page.createElement('style');
	css_snippet.innerHTML = '';

	var li_snippet = page.createElement('li');
	li_snippet.innerHTML = '<a href="http://wiki-trust.cse.ucsc.edu/index.php/'
	    + article + '" title="Trust colored version of this page">'
	    + 'trust info</a>';

	var pcActions = page.getElementById('p-cactions');
	var children = pcActions.childNodes;
	var pBody = false;
	for (var i=0; i<children.length; i++) {
	    var node = children[i];
	    log("node: " + i);
	    if (node.nodeType == 1)
		log("class = " + node.getAttribute("class"));
	    if (node.nodeType == 1 && node.getAttribute("class") == "pBody") {
		pBody = node;
	    }
	}
	if (!pBody) {
	    log("Didn't find pBody");
	    return;
	}
	var ul = false;
	var children = pBody.childNodes;
	for (var i = 0; i<children.length; i++) {
	    var node = children[i];
	    log("node: " + i);
	    if (node.nodeType == 1) {
		log("name = " + node.nodeName);
		ul = node;
	    }
	}
	ul.appendChild(li_snippet);

	log("added trust to page.");
    }

    window.addEventListener("load", function(e) {
	document.getElementById("appcontent").addEventListener(
		"DOMContentLoaded", maybeAddTrust, false);
    }, false);
})();
