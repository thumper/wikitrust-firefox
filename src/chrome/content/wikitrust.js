// Copyright 2009, B. Thomas Adler

(function() {
    const MAX_TRUST_VALUE = 9;
    const MIN_TRUST_VALUE = 0;
    const TRUST_MULTIPLIER = 10;
    const COLORS = [ "trust0", "trust1", "trust2", "trust3", "trust4", "trust5", "trust6", "trust7", "trust9", "trust10" ];

    const default_MwURL = 'http://wikitrust.fastcoder.net:10032/'; // mediawiki
    const default_MpURL = 'http://wikitrust.fastcoder.net:8034/'; // modperl
    const default_WpURL = 'http://en.wikipedia.org/w/api.php'; // wikipedia
    const prefService = Components.classes["@mozilla.org/preferences-service;1"].
		getService(Components.interfaces.nsIPrefBranch);

    function getPrefBool(pref, defval) {
	var prefname = "extensions.wikitrust." + pref;
	try {
	    var value = prefService.getBoolPref(prefname);
	    return value;
	} catch (ex) {
	    prefService.setBoolPref(prefname, defval);
	    return defval;
	}
    }

    function getPrefStr(pref, defval) {
	var prefname = "extensions.wikitrust." + pref;
	try {
	    var value = prefService.getCharPref(prefname);
	    return value;
	} catch (ex) {
	    return defval;
	}
    }

    var aConsoleService = Components.classes["@mozilla.org/consoleservice;1"].
		getService(Components.interfaces.nsIConsoleService);

    function log(str) {
	var now = new Date();
	aConsoleService.logStringMessage("wikitrust: "
		+ now.getTime() + ": " + str);
    }

    function http_get(path, success, failure) {
	if (!path) return failure(null);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
	    if(request.readyState == 4)
	      if(request.status == 200)
		success(request);
	      else
		failure(request);
	};
	request.open('GET', path, true);
	//request.setRequestHeader("Cache-Control", "max-age=0");
	request.send(null);
    }

    function http_post(path, params, success, failure) {
	if (!path) return failure(null);
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
	    if(req.readyState == 4)
	      if(req.status == 200)
		success(req);
	      else
		failure(req);
	};
	req.open('POST', path, true);
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.setRequestHeader("Content-Length", params.length);
	req.setRequestHeader("Connection", "close");
	req.send(params);
    }

    function getQueryVariable(search, varname) {
	var query = search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
	    var pair = vars[i].split('=');
	    if (pair[0] == varname)
		return pair[1];
	}
	return '';
    }

    function isEnabledWiki(loc) {
	var hostname = "en.wikipedia.org";
	hostname = getPrefStr('hostname', hostname);
	try {
	    if (loc.host == hostname) return true;
	    else return false;
	} catch (x) { return false; }
    }

    function getTitleFUrl(loc) {
	var title = getQueryVariable(loc.search, 'title');
	if (title != '') return title;
	var match = /^\/wiki\/(.*)$/.exec(loc.pathname);
	if (match[1] != '') return unescape(match[1]);
	match = /^\/w\/index\.php\/(.*)$/.exec(loc.pathname);
	if (match[1] != '') return unescape(match[1]);
	
	return null;
    }

    function getWikiTrustURL(page) {
	var loc = page.location;
	if (/&diff=/.test(loc.search)) return null;
	if (/&action=/.test(loc.search)) return null;
	var title = getTitleFUrl(loc);
	var wgArticleId = '';
	var revID = getQueryVariable(loc.search, 'oldid');
	if (revID == '') revID = getQueryVariable(loc.search, 'diff');
	try {
	    var safeWin = page.defaultView;
	    var unsafeWin = safeWin.wrappedJSObject;
	    if (revID == '')
		revID = unsafeWin.wgCurRevisionId;
	    wgArticleId = unsafeWin.wgArticleId;
	} catch (x) { alert(x); }

	if (revID == '' && wgArticleId == '' && title == '') {
	    log("Couldn't figure out vars from: " + loc.href);
	    return null;
	}
	if (!/^\d+$/.test(revID) || !/^\d+$/.test(wgArticleId)) {
	    log("Bad vars from: " + loc.href);
	    log("revID=["+revID+"]");
	    log("wgArticleId=["+revID+"]");
	    return null;
	}

	var url = getPrefStr('wtModPerl', default_MpURL);
	url += '?method=gettext'
	    + '&title=' + encodeURIComponent(title)
	    + '&pageid=' + wgArticleId
	    + '&revid=' + revID;
	return url;
    }

    function getStrippedURL(loc) {
	if (/&diff=/.test(loc.search) || /&action=/.test(loc.search)
		|| /trust/.test(loc.search))
	{
	    var title = getTitleFUrl(loc);
	    log("stripped action: title = " + title);
	    return "/wiki/" + title;
	}
	log("stripped nothing: search = " + loc.search);
	return loc.pathname + loc.search;
    }

    function getTrustTabURL(loc) {
	if (/[?&]trust/.test(loc.search)) return loc.href;
	var url = getStrippedURL(loc);
	if (/\?/.test(url)) return url + '&trust';
	else return url + '?trust';
    }

    function color_Wiki2Html(title, medianTrust, colored_text, continuation) {
	var genericHandler = function (preserve) {
	    return function (match, one, two, three, four) {
		try {
		    var trust = parseFloat(one) + 0.5;
		    var normalized_value = min(MAX_TRUST_VALUE,
			    max(MIN_TRUST_VALUE,
				(trust * TRUST_MULTIPLIER / medianTrust)
			    ));
		    var class = COLORS[Math.round(normalized_value)];
		    var replace = '<span class="'+class+'" onclick="showOrigin('
			+ two + ')">'+preserve(four)+'</span>';
		    return replace;
		} catch (x) {
		    log(x);
		    return preserve(four);
		}
	    };
	};

	// First, clean tags around links
	var templates = /\{\{#t:(\d+),(\d+),([^}]+)\}\}\s*\[\[([^\]]+)\]\]\*(?=\{\{#t:|$)/g;
	colored_text = colored_text.replace(templates,
	    genericHandler(function(txt) { return '[['+txt+']]'; })
	);

	// Need Wikipedia parser to do some work, too.
	var wpurl = getPrefStr('wpApiUrl', default_WpURL);
	var params = '&action=parse&format=json'
		+ '&title=' + encodeURIComponent(title)
		+ '&text='  + encodeURIComponent(colored_text);
	http_post(wpurl, params,
	    function(req) {
		var json = eval('('+req.responseText+')');
		var colored_text = json.parse.text['*']
			+ '<br/><table border="1" cellpadding="5" cellspacing="0" style="background:lightgreen; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>The article text is colored according to how much it has been revised.  An orange background indicates new, unrevised, text;  white is for text that has been revised by many reputed authors.  If you click on a word, you will be redirected to the diff corresponding to the edit where the word was introduced.</td></tr>'
			+ '<tr><td>The text color and origin are computed by <a href="http://wikitrust.soe.ucsc.edu/" class="external text" title="http://wikitrust.soe.ucsc.edu/" rel="nofollow">WikiTrust</a>; if you notice problems, you can submit a bug report <a href="http://code.google.com/p/wikitrust/issues" class="external text" title="http://code.google.com/p/wikitrust/issues" rel="nofollow">here</a>.</td></tr>'
			+ '</table>';
		json = undefined;

		// Fix edit section links
		colored_text = colored_text.replace(/title="Edit section: (.*?)">/g,
		    function (match, one) {
			one = one.replace(/\{\{#t:\d+,\d+,[^}]+\}\}/g, '');
			return 'title="Edit section: '+one+'">';
		    }
		);

		// Fix trust tags with plain text after
		var plaintxt = /\{\{#t:(\d+),(\d+),([^}]+)\}\}([^\{<]*)(?=\{\{#t|<|$)/g;
		colored_text = colored_text.replace(plaintxt,
		    genericHandler(function(txt) { return txt; })
		);

		// And eliminate any remaining trust tags
		colored_text = colored_text.replace(/\{\{#t:\d+,\d+,[^}]+\}\}/g, '');

		return continuation(colored_text);
	    },
	    function(req) {
		continuation('');
	    });
    }

    function fixHrefs(node) {
        if (node.nodeName == 'A') {
            var url = node.getAttribute('HREF');
	    if (url) {
		var sep = '&';
		if (url.indexOf('?') == -1) {
		    sep = '?';
		}
		var add = false;
		if (/^\/wiki\//.test(url))
		    add = true;
		if (/^\/w\/index\.php/.test(url))
		    add = true;
		if (add)
		    url += sep + 'trust';
		node.setAttribute('HREF', url);
	    }
        }
        var children = node.childNodes;
        for (var i=0; i<children.length; i++) {
            fixHrefs(children[i]);
        }
    }

    function addTrustHeaders(page) {
	var css = page.createElement('link');
	css.setAttribute('rel', 'stylesheet');
	css.setAttribute('type', 'text/css');
	var url = getPrefStr('wgScriptPath', default_MwURL);
	url = url + "/extensions/WikiTrust/css/trust.css";
	css.setAttribute('href', url);

	var script = page.createElement('script');
	var url = getPrefStr('wgScriptPath', default_MwURL);
	url = url + '/extensions/WikiTrust/js/trust.js';
	script.setAttribute('src', url);
	// script.innerHTML = 'function showOrigin(revnum) { document.location.href = "/w/index.php?title=" + wgPageName + "&oldid=" + revnum; }';

	var head = page.getElementsByTagName('head')[0];
	head.appendChild(css);
	head.appendChild(script);

	var tscript = page.createElement('script');
	var turl = getPrefStr('wgScriptPath', default_MwURL);
	turl = turl + '/extensions/WikiTrust/js/wz_tooltip.js';
	tscript.setAttribute('src', turl);
	head.appendChild(tscript);

	return null;
    }

    function max(a,b) { return (a > b) ? a : b; }
    function min(a,b) { return (a < b) ? a : b; }

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
	var dropSheetHeight=max(body.scrollHeight,page.documentElement.clientHeight);

	dropSheet.style.width=dropSheetWidth+'px';
	dropSheet.style.height=dropSheetHeight+'px';

	body.appendChild(dropSheet);

	return dropSheet;
    }

    function showDialog(page,msg,width,height){
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

	dialog.innerHTML=msg;
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

    function addVotingHandler(page, el) {
	var revID = getQueryVariable(page.location.search, 'oldid');
	if (revID == '') revID = getQueryVariable(page.location.search, 'diff');
	var clickHandler = function (e) {
	  try {
	    var vote_a = page.getElementById('wt-vote-link');
	    var vote_1 = page.getElementById('vote-button');
	    var vote_2 = page.getElementById('vote-button-done');
	    var safeWin = page.defaultView;
	    var unsafeWin = safeWin.wrappedJSObject;
	    var wgUserName = unsafeWin.wgUserName;
	    if (wgUserName == null) wgUserName = '';
	    var wgArticleId = unsafeWin.wgArticleId;
	    var wgPageName = unsafeWin.wgPageName;
	    var wgCurRevisionId = unsafeWin.wgCurRevisionId;
	    if (vote_a) vote_a.innerHTML = 'Voting...';
	    if (revID == '') revID = wgCurRevisionId;
	    if (!/^\d+$/.test(revID) || !/^\d+$/.test(wgArticleId)) {
		log("vote: revID=["+revID+"]");
		log("vote: wgArticleId=["+revID+"]");
		return false;
	    }

	    // Need to go through MW interface, because we don't
	    // have access to userid
	    var url = getPrefStr('wgScriptPath', default_MwURL);
	    url += 'index.php?action=ajax&rs=WikiTrust::ajax_recordVote'
		    + '&rsargs[]='+ encodeURIComponent(wgUserName)
		    + '&rsargs[]=' + wgArticleId
		    + '&rsargs[]=' + revID
		    + '&rsargs[]=' + encodeURIComponent(wgPageName);
	    log("voting url: " + url);
	    if (vote_1) vote_1.style.visibility='hidden';
	    if (vote_2) vote_2.style.visibility='visible';
	    http_get(url,
		function (req) {
		    if (vote_a) vote_a.innerHTML = 'Thanks for voting!'
		    log("Voting request text: " + req.responseText);
		    el.click = null;
		},
		function (req) {
		    if (vote_a) vote_a.innerHTML = 'Voting error.';
		    log("Voting request status: " + req.status);
		    log("Voting request text: " + req.responseText);
		    el.click = null;
		});
	    return false;
	  } catch (ex) { log(ex); }
	};
	el.addEventListener("click", clickHandler, false);
    }

    function maybeAddTrustTab(page) {
	if (!isEnabledWiki(page.location)) return null;

	var mainTab = page.getElementById('ca-nstab-main');
	if (!mainTab) return null;		// we only add to main articles
	if (mainTab.getAttribute("class") != "selected") return null;

	var articleURL = getTrustTabURL(page.location);
	
	var trust_li = page.getElementById('ca-trust');
	if (trust_li) {
	    log("trust tab already on page.");
	    return null;	// already done, eh?
	}

	// And modify page to display "check trust" tab
	trust_li = page.createElement('li');
	trust_li.setAttribute("id", "ca-trust");
	trust_li.innerHTML = '<a href="'
	    + articleURL + '" title="Trust colored version of this page">'
	    + 'trust info</a>';

	var ul = mainTab.parentNode;
	ul.appendChild(trust_li);

	var cite_li = page.getElementById('t-cite');
	if (!cite_li) return null;	

	var vote_a = page.createElement('a');
	vote_a.setAttribute('id', 'wt-vote-link');
	vote_a.href = '#voted';
	vote_a.onClick = function (e) { return false; };
	addVotingHandler(page, vote_a);
	vote_a.innerHTML ='Vote for this page';
	var vote_li = page.createElement('li');
	vote_li.setAttribute('id', 't-vote');
	vote_li.appendChild(vote_a);

	ul = cite_li.parentNode;
	ul.appendChild(vote_li);


	return trust_li;
    }

    function maybeColorPage(page, tab) {
	if (!tab) return;
	if (!/[?&]trust\b/.test(page.location.search)) return;
	addTrustHeaders(page);
	var wtURL = getWikiTrustURL(page);
	if (!wtURL) return;
	tab.setAttribute('class', 'selected');
	var addedNodes = new Array();
	addedNodes.push(darkenPage(page));
	addedNodes.push(showDialog(page,
		"<p>Downloading trust information...</p>", 300,100));
	log("Requesting trust url = " + wtURL);
	var failureFunc = function (req) {
		log("trust page failed to download, status = " + req.status);
		removeExtras(addedNodes);
		addedNodes.push(darkenPage(page));
		addedNodes.push(showDialog(page,
		    "<p>Failed to contact trust server...</p>", 300,100));
	    };
	http_get(wtURL, function (req) {
		log("http_get: "+wtURL);
		log("trust page downloaded successfully.");
		if (req.responseText == null) {
		    log("ERROR: empty response");
		    return failureFunc(req);
		}
		try {
		    var colored_text = req.responseText;
		    var comma = colored_text.indexOf(',');
		    var medianTrust = parseFloat(colored_text.substr(0, comma));
		    colored_text = colored_text.substring(comma+1);
		    var title = getTitleFUrl(page.location);
		    color_Wiki2Html(title, medianTrust, colored_text, function(txt) {
			if (!txt) {
			    log("ERROR: no color info");
			    return failureFunc(req);
			}

			removeExtras(addedNodes);
			var trustDiv = page.createElement('div');
			trustDiv.setAttribute('id', 'trust-div');

			var bodyContent = page.getElementById('bodyContent');
			var siteSub = page.getElementById('siteSub');
			var contentSub = page.getElementById('contentSub');
			var catlinks = page.getElementById('catlinks');
			bodyContent.innerHTML = '';
			bodyContent.appendChild(siteSub);
			bodyContent.appendChild(contentSub);
			bodyContent.appendChild(trustDiv);
			if (catlinks) bodyContent.appendChild(catlinks);
			trustDiv.innerHTML = txt;
			fixHrefs(bodyContent);
			var expl = page.getElementById('wt-expl');
			if (expl) bodyContent.insertBefore(expl, bodyContent.firstChild);
			var coords = page.getElementById('coordinates');
			if (coords) coords.style.cssText = 'top: -20px !important';
			var voteButton = page.getElementById('wt-vote-button');
			addVotingHandler(page, voteButton);
		    });
		} catch(x) { log("maybeColorPage: "+x); }
	    }, failureFunc);
    }

    window.addEventListener("load", function(ev) {
	document.getElementById("appcontent").addEventListener(
		"DOMContentLoaded",
	    function(ev) {
		var page = ev.originalTarget;
		if (page.nodeName != "#document") return;
		if (!page.location) return;

		log("DOMContentLoaded event for loc="+page.location);

		try {
		    var tab = maybeAddTrustTab(page);
		    maybeColorPage(page, tab);
		} catch (e) {
		    log(e);
		};
	    }, false);
    }, false);
})();
