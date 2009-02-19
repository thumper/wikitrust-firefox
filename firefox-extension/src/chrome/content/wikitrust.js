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

    function addTrustStyle(page) {
	var head = page.getElementsByTagName('head')[0];
	var css = page.createElement('style');
	css.setAttribute('type', 'text/css');
	css.inner_HTML= '';
	head.appendChild(css);
	return css;
    }

    function max(a,b) { return (a > b) ? a : b; }

    function darkenPage(page) {
	var dropSheet=page.createElement('div');
	dropSheet.setAttribute('id','dropSheet');
	dropSheet.style.position = 'absolute';
	dropSheet.style.top = '0px';
	dropSheet.style.left = '0px';
	dropSheet.style.overflow = 'hidden';
	dropSheet.style.MozOpacity = 0.7;
	dropSheet.style.zIndex = 20;
	dropSheet.style.backgroundColor='#000000';
	dropSheet.style.width='100%';
	dropSheet.style.height='100%';

	var body = page.getElementsByTagName('body')[0];
	var dropSheetWidth=max(body.scrollWidth,page.documentElement.clientWidth);
	var dropSheetHeight=max(body.scrollHeight,document.documentElement.clientHeight);

	dropSheet.style.width=dropSheetWidth+'px';
	dropSheet.style.height=dropSheetHeight+'px';

	body.appendChild(dropSheet);

	return dropSheet;
    }

    function showDialog(page,width,height){
	var dialog = page.createElement('div');
	dialog.id="details";
	dialog.style.width=width+'px';
	dialog.style.height=height+'px';
	dialog.style.position = 'absolute';
	dialog.style.backgroundColor = '#FF9B00';
	dialog.style.padding = '5px';
	dialog.style.textAlign = 'left';
	dialog.style.overflow = 'auto';
	dialog.style.color = '#000000';
	dialog.style.border = '2px solid #000000';
	dialog.style.font = '18px Arial, Helvetica, sans-serif';
	dialog.style.zIndex = 30;

	dialog.innerHTML='<p>Downloading trust information now...</p>';
	var viewportX=page.documentElement.clientWidth;
	var viewportY=page.documentElement.clientHeight;
	dialog.style.top=(viewportY/2)-(height/2)+'px';
	dialog.style.left=(viewportX/2)-(width/2)+'px';

	var body = page.getElementsByTagName('body')[0];
	body.appendChild(dialog);

	return dialog;
    }



    function removeExtras(list){
	for (var i in list) {
	    list[i].parentNode.removeChild(list[i]);
	}
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
	var addedNodes = new Array();
	// addedNodes.push(addTrustStyle(page));
	addedNodes.push(darkenPage(page));
	addedNodes.push(showDialog(page,300,100));
	var content = page.getElementById('content');
	// content.style.display = 'none';
	log("reset content");
	//removeExtras(addedNodes);
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
