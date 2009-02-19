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
	var dom = loc.host.indexOf('.wikipedia.org');
	if (dom < 0) return null;
	else return loc.host.substr(0, dom);
    }

    var baseURL = "http://wiki-trust.cse.ucsc.edu/index.php";

    function getWikiTrustURL(loc) {
	if (/&diff=/.test(loc.search)) return null;
	if (/&action=/.test(loc.search)) return null;
	var match = /^\/wiki\/(.*)$/.exec(loc.pathname);
	if (match != null) return baseURL + "/" + match[1] + loc.search;
	match = /^\/w\/index\.php(.*)$/.exec(loc.pathname);
	if (match != null) return baseURL + match[1] + loc.search;
	return null;
    }

    function getTrustURL(loc) {
	if (/\?/.test(loc.href)) return loc.href + "&trust";
	else return loc.href + "?trust";
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

    function maybeAddTrustTab(page) {
	log("testing location: " + page.location);
	var lang = getWikiLang(page.location);
	if (!lang) return null;
	log("lang = " + lang);

	var mainTab = page.getElementById('ca-nstab-main');
	if (!mainTab) return null;		// must not be a main article!
	if (mainTab.getAttribute("class") != "selected") return null;

if (0) {
	var articleURL = getTrustURL(page.location);
	if (!articleURL) {
	    var editTab = page.getElementById('ca-edit');
	    var anchor = findChild(editTab, "A");
	    var loc = {
		pathname: anchor.getAttribute("href"),
		search: '',
	    };
	    articleURL = getTrustURL(loc);
	    articleURL = articleURL.replace(/&action=edit/, '');
	}
}
	var articleURL = getTrustURL(page.location);
	

	// And modify page to display "check trust" tab
	var li = page.createElement('li');
	li.setAttribute("id", "ca-trust");
	li.innerHTML = '<a href="'
	    + articleURL + '" title="Trust colored version of this page">'
	    + 'trust info</a>';

	var ul = mainTab.parentNode;
	ul.appendChild(li);

	log("added ca-trust");

	return li;
    }

    function maybeColorPage(page, tab) {
	if (!tab) return;
	if (!/[\?&]trust$/.test(page.location.search)) return;
	tab.setAttribute('class', 'selected');
	var content = page.getElementById('content');
	log("content name = " + content.nodeName);
	content.innerHTML = '<p>Downloading replacement information</p>';
	// content.style.display = 'none';
	log("reset content");
    }

    window.addEventListener("load", function(ev) {
	document.getElementById("appcontent").addEventListener(
		"DOMContentLoaded",
	    function(ev) {
		var page = ev.originalTarget;
		if (page.nodeName != "#document") return;
		if (!page.location) return;

		try {
		    var tab = maybeAddTrustTab(page);
		    maybeColorPage(page, tab);
		} catch (e) {
		    log(e);
		};
	    }, false);
    }, false);
})();
