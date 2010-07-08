// Copyright 2009-2010, B. Thomas Adler

(function() {
  const langmsgs = {
	en: { success: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightgreen; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>The article text is colored according to how much it has been revised.  An orange background indicates new, unrevised, text;  white is for text that has been revised by many reputed authors.  If you CTRL-ALT-click on a word, you will be redirected to the diff corresponding to the edit where the word was introduced.</td></tr>'
			+ '<tr><td>The text color and origin are computed by <a href="http://wikitrust.soe.ucsc.edu/" class="external text" title="http://wikitrust.soe.ucsc.edu/" rel="nofollow">WikiTrust</a>; if you notice problems, you can submit a bug report <a href="http://code.google.com/p/wikitrust/issues" class="external text" title="http://code.google.com/p/wikitrust/issues" rel="nofollow">here</a>.</td></tr>'
			+ '</table>',
			tabhover:  'Trust colored version of this page',
			tabtext: 'WikiTrust',
			downloadtrust: '<p>Downloading trust information from UC Santa Cruz...</p>',
			downloadhtml: '<p>Requesting HTML from Wikipedia...</p>',
			ErrWpAPI: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>There was an error while contacting Wikipedia for HTML content.</td></tr></table>',
			ErrBadTrust: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>There was an error while contacting UCSC for the trust content.</td></tr></table>',
			ErrNoTrust: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>There is no trust coloring information currently available for the revision you requested.  '
			+ 'Please try again in about a minute, when the coloring should be complete.</td></tr></table>',
			ErrMsg: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>MSG</td></tr></table>',
		 },
	it: { success: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightgreen; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ "<tr><td>Il testo dell'articolo è colorato in base a quanto è stato rivisto.  Uno sfondo arancione indica che il testo è nuovo, e non rivisto; bianco è per il testo che è stato rivisto da molti autori.  Se si fa CTRL-ALT-clic su una parola, sarete inviati ad una pagina che mostra la modifica apportata alla voce quando la parola è stata introdotta.</td></tr>"
			+ '<tr><td>Il colore del testo, e l\'origine delle parole, sono calcolate da <a href="http://wikitrust.soe.ucsc.edu/" class="external text" title="http://wikitrust.soe.ucsc.edu/" rel="nofollow">WikiTrust</a>.  In caso di problemi, potete inviare un resoconto <a href="http://code.google.com/p/wikitrust/issues" class="external text" title="http://code.google.com/p/wikitrust/issues" rel="nofollow">qui</a>.</td></tr>'
			+ '</table>',
			//tabtext: 'stabilità testo',
			tabhover:  'Trust versione colorata di questa pagina',
			downloadtrust: "<p>Lo scaricamento dell'informazione sull'affidabilità del testo è in corso da UC Santa Cruz...</p><p>(Downloading the trust information from UC Santa Cruz...)</p>",
			downloadhtml: "<p>Trasferimento dell'informazione da Wikipedia in corso...</p><p>(Downloading information from Wikipedia is in progress...)</p>",
			ErrWpAPI: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>Si è verificato un errore durante il contatto con Wikipedia per i contenuti HTML.</td></tr></table>',
			ErrBadTrust: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>Si è verificato un errore contattando i servers a UC Santa Cruz.</td></tr></table>',
			ErrNoTrust: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>L\'informazione su questa revisione non è ancora stata calcolata.  Riprovate tra qualche decina di secondi: il sistema <a href="http://wikitrust.soe.ucsc.edu" class="external text" rel="nofollow">WikiTrust</a> sta calcolando l\'informazione per voi.</td></tr></table>'
		 },
	pt: { },
	no: {
	    tabtext: 'wikitruth',
	},
	pl: { success: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightgreen; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>Tekst w artykule został pokolorowany w zależności od tego jak często był przeglądany w wyniku edytowania artykułu. Pomarańczowe tło oznacza nowy, nieprzejrzany tekst; natomiast białe tło oznacza tekst, który był wielokrotnie przeglądany przez zaufanych edytorów artykułu.  Jeśli CTRL-ALT-klikniesz na wyraz, to zobaczysz edycję, podczas której ten wyraz został dodany.</td></tr>'
			+ '<tr><td>Tło tekstu oraz informacja o źródłowej edycji wyrazu zostały wygenerowane przez <a href="http://wikitrust.soe.ucsc.edu/" class="external text" title="http://wikitrust.soe.ucsc.edu/" rel="nofollow">WikiTrust</a>. Jeśli dostrzeżesz jakieś problemy, możesz zgłosić raport o błędzie <a href="http://code.google.com/p/wikitrust/issues" class="external text" title="http://code.google.com/p/wikitrust/issues" rel="nofollow">pod tym linkiem</a>.</td></tr>'
			+ '</table>',
			tabhover:  'Sprawdź wiarygodność tej strony za pomocą pokolorowanej wersji',
			downloadtrust: '<p>Pobieranie przeanalizowanego tekst z UC Santa Cruz...</p>',
			downloadhtml: '<p>Żądanie zawartości HTML z Wikipedii...</p>',
			ErrWpAPI: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>Wystąpił błąd podczas pobierania zawartości HTML z Wikipedii.</td></tr></table>',
			ErrBadTrust: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>Wystąpił błąd podczas pobierania przeanalizowanej treści z UCSC.</td></tr></table>',
			ErrNoTrust: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>Sprawdzenie wiarygodności tej wersji za pomocą kolorowania jest chwilowo niemożliwe. Spróbuj ponownie za około minutę, kiedy kolorowanie powinno zostać zakończone.</td></tr></table>'
		 },
	de: { success: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightgreen; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>Die farbliche Markierung des Artikeltextes zeigt, was bereits überprüft wurde: Die Orange Markierung steht für neuen, noch nicht überprüften Text; die weiße Markierung steht für Text, der von verschiedenen Autoren durchgesehen wurde. Wenn Du auf ein Wort CTRL-ALT-klickst, wirst Du zum Versionsunterschied geleitet, der auf diejenige Artikelversion zurückgreift, in der das entsprechende Wort eingefügt wurde.</td></tr>'
			+ '<tr><td>Die Textfarbe und der Textursprung können mit folgenden Befehlen bestimmt werden: [<a href="http://wikitrust.soe.ucsc.edu/" class="external text" title="http://wikitrust.soe.ucsc.edu/" rel="nofollow">WikiTrust</a>]; bei Problemen kannst Du auch einen: [<a href="http://code.google.com/p/wikitrust/issues" class="external text" title="http://code.google.com/p/wikitrust/issues" rel="nofollow">Fehler melden</a>].</td></tr>'
			+ '</table>',
			tabhover:  'Dies ist eine Version, die den WikiTrust-Prozess durchlaufen hat',
			downloadtrust: '<p>Informationsdownload von UC Santa Cruz...</p>',
			downloadhtml: '<p>Frage HTML bei der Wikipedia an...</p>',
			ErrWpAPI: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>Ein Fehler tritt beim Verbindungsaufbau mit Wikipedia auf.</td></tr></table>',
			ErrBadTrust: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>Ein Fehler tritt beim Verbindungsaufbau mit UCSC auf.</td></tr></table>',
			ErrNoTrust: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>Für die angefragte Überarbeitung ist zurzeit leider keine Textanalyseinformation verfügbar. Bitte versuche es in zirka 30 Sekunden noch einmal. Die Analyse sollte dann beendet sein.</td></tr></table>'
		 },
    fr: { success: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightgreen; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>Le texte est coloré en fonction de combien il a été révisé. Un fond orange signifie un texte neuf, non révisé, tandis qu\'un fond blanc signifie que le texte a été révisé par des auteurs réputés. Si vous CTRL-ALT-cliquez sur un mot, vous serez envoyés à la révision qui a introduit ce mot.</td></tr>'
			+ '<tr><td>La couleur du texte et l\'origine des mots sont calculés par <a href="http://wikitrust.soe.ucsc.edu/" class="external text" title="http://wikitrust.soe.ucsc.edu/" rel="nofollow">WikiTrust</a>. Si vous notez un problème, vous pouvez le signaler <a href="http://code.google.com/p/wikitrust/issues" class="external text" title="http://code.google.com/p/wikitrust/issues" rel="nofollow">ici</a>.</td></tr>'
			+ '</table>',
			tabhover:  'Trust version colorée de cette page',
			downloadtrust: '<p>Téléchargement d\'information de UC Santa Cruz en cours ...</p>',
			downloadhtml: '<p>Demande d\'information de Wikipedia en cours ...</p>',
			ErrWpAPI: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>Erreur de connexion à Wikipedia.</td></tr></table>',
			ErrBadTrust: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td> Erreur de connexion à UCSC.</td></tr></table>',
			ErrNoTrust: '<table border="1" cellpadding="5" cellspacing="0" style="background:lightpink; color:black; margin-top: 10px; margin-bottom: 10px;" id="wt-expl">'
			+ '<tr><td>Wikitrust n\'a pas terminé de calculer l\'information relative à la révision choisie. '
			+ 'Réessayez dans une minute.</td></tr></table>'
		 },
	};


    const debug = false;		// to test new renderings

    const FEATURE_TOOLTIP = false;
    const FEATURE_VOTING = false;
    const MAX_TRUST_VALUE = 9;
    const MIN_TRUST_VALUE = 0;
    const TRUST_MULTIPLIER = 10;
    const COLORS = [ "trust0", "trust1", "trust2", "trust3", "trust4", "trust5", "trust6", "trust7", "trust9", "trust10" ];

    const prefService = Components.classes["@mozilla.org/preferences-service;1"].
		getService(Components.interfaces.nsIPrefBranch);
    var enabledWikis = { };

    function getPrefBool(pref, defval) {
	var value, prefname = "extensions.wikitrust." + pref;
	try {
	    value = prefService.getBoolPref(prefname);
	    return value;
	} catch (ex) {
	    prefService.setBoolPref(prefname, defval);
	    return defval;
	}
    }

    function getPrefStr(pref, defval) {
	var value, prefname = "extensions.wikitrust." + pref;
	try {
	    value = prefService.getCharPref(prefname);
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

    function getJsonNativeParser() {
	return JSON.parse;
    }

    function getJsonNsiParser() {
	var JSON = Components.classes["@mozilla.org/dom/json;1"].
	    createInstance(Components.interfaces.nsIJSON);
	return function(str) {
		return JSON.decode(str);
	    };
    }

    function getJsonParser() {
	var p, getter, parser, jobj,
	    jstr = '{"bar":"foo", "baz":3}',
	    parsers = { 'native': getJsonNativeParser,
			'nsi': getJsonNsiParser };
	for (p in parsers) {
	    log('JSON: trying parser '+p);
	    try {
		getter = parsers[p];
		parser = getter();
		log('JSON: attempting to parse');
		jobj = parser(jstr);
		if (!jobj) {
		    log('JSON: jobj was null?!?');
		    throw 'null obj';
		}
		log('JSON: parser worked!');
		return parser;
	    } catch (x) {
		log('JSON: parser failed: '+x);
	    }
	}
	log('JSON: complete failure!');
	return null;
    }

    var JsonParser = getJsonParser();

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
	var i, pair,
	    query = search.substring(1),
	    vars = query.split('&');
	for (i = 0; i < vars.length; i++) {
	    pair = vars[i].split('=');
	    if (pair[0] == varname)
		return pair[1];
	}
	return '';
    }

    function getWikiLang(loc) {
	try {
	    if (loc.host == 'secure.wikimedia.org') {
		var match = /^\/wikipedia\/([^\/]+)\//.exec(loc.pathname);
		// unescape() doesn't decode utf8.  Use decodeURIComponent().
		if (match && match[1] != '') return decodeURIComponent(match[1]);
		return null;
	    }
	    // Otherwise, traditional <en>.wikipedia.org url
	    var dompos = loc.host.indexOf('.wikipedia.org');
	    if (dompos < 0) return null;
	    else return loc.host.substr(0, dompos);
	} catch (x) {
	    return null;
	}
    }

    function getWikiAPI(loc) {
	try {
	    var lang = getWikiLang(page.location);
	    if (!lang) return null;
	    if (loc.host == 'secure.wikimedia.org')
		return 'https://secure.wikimedia.org/wikipedia/'+lang+'/w/api.php';
	    return 'http://' + lang + '.wikipedia.org/w/api.php';
	} catch (x) {
	    return null;
	}
    }

    function getWikitrustAPI(loc) {
	const default_WtURL = '.collaborativetrust.com/WikiTrust/'; // wikitrust
	var lang = getWikiLang(loc);
	if (!lang) return null;
	var wtURL = 'http://'+ lang + getPrefStr('wtUrl', default_WtURL);
	return wtURL;
    }

    function isEnabledWiki(lang) {
	if (!lang) return false;
	var result = (lang in langmsgs),
	    now = new Date().getTime();
	if (lang in enabledWikis)
	    result = enabledWikis[lang]['enabled'];
	else {
	    enabledWikis[lang] = {
		    lastcheck: (now - 10000),
		    enabled: result,
		};
	}
	    
	var enabled = enabledWikis[lang];
	if ((now-enabled['lastcheck'])>3600) {
	    enabled['lastcheck'] = now;
	    var wtURL = 'http://'+ lang + getPrefStr('wtUrl', default_WtURL);
	    wtURL += 'RemoteAPI?method=miccheck';
	    http_get(wtURL, function (req) {
		    if (req.responseText == 'OK')
			enabled['enabled'] = true;
		    else
			enabled['enabled'] = false;
		}, function (req) {
		    enabled['enabled'] = false;
		});
	}
	return result;
    }

    function getMsg(lang, msg) {
	if (!(lang in langmsgs)) lang = 'en';
	if (!(msg in langmsgs[lang])) lang = 'en';
	return langmsgs[lang][msg];
    }

    function getBoxedMsg(page, lang, msg) {
	var box=page.createElement('div');
	box.innerHTML = getMsg(lang,msg);
	return box;
    }

    function getTitleFUrl(loc) {
	var title = getQueryVariable(loc.search, 'title');
	if (title != '') return title;
	// Trying to match against:
	//    en.wikipedia.org/wiki/Main_Page
	//    en.wikipedia.org/w/index.php?title=Main_Page
	//    secure.wikimedia.org/wikipedia/en/wiki/Main_Page
	//    secure.wikimedia.org/wikipedia/en/w/index.php?title=Main_Page
	var match = /\/wiki\/(.*)$/.exec(loc.pathname);
	// unescape() doesn't decode utf8.  Use decodeURIComponent().
	if (match && match[1] != '') return decodeURIComponent(match[1]);
	match = /\/w\/index\.php\/(.*)$/.exec(loc.pathname);
	if (match && match[1] != '') return decodeURIComponent(match[1]);
	return null;
    }

    function getWikiParams(page) {
	var loc = page.location,
	    lang = getWikiLang(loc);
	if (!isEnabledWiki(lang)) return null;
	if (/&diff=/.test(loc.search)) return null;
	if (/&action=/.test(loc.search)) return null;
	var title = getTitleFUrl(loc);
	var wgArticleId = '';
	var revID = getQueryVariable(loc.search, 'oldid');
	var dir = getQueryVariable(loc.search, 'direction');
	if (dir != '') revID =  '';
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
	return [title, wgArticleId, revID];
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

    function color_Wiki2Html(loc, title, revid, medianTrust, colored_text, continuation, failureFunc) {
      var genericHandler = function (match, trval, oid, username, txt) {
	  try {
	      var trust = parseFloat(trval) + 0.5;
	      var normalized_value = min(MAX_TRUST_VALUE,
		      max(MIN_TRUST_VALUE,
			  (trust * TRUST_MULTIPLIER / medianTrust)
		      ));
	      var classname = COLORS[Math.round(normalized_value)];
	      // use fake ':click=', because WikipediaAPI removes onclick
	      // handler.  We will fix after WpAPI step.
	      var replace = '<span class="'+classname+':click=return showOrg2(event,'
		  + oid + ');">'+txt+'</span>';
	      return replace;
	  } catch (x) {
	      log(x);
	      return txt;
	  }
      };

      try {
	// First, clean tags around links
	var templates = /\{\{#t:(\d+),(\d+),([^}]+)\}\}(\s*)\[\[([^\]]+)\]\](\s*)(?=\{\{#t:|$)/mg;
	colored_text = colored_text.replace(templates,
	  function (match, p1, p2, p3, p4, p5, p6) {
	    return p4 + genericHandler(match, p1, p2, p3, '[['+p5+']]') + p6;
	  }
	);
	// And also clean tags after a semi-colon
	var semicolons = /^(;\s*)\{\{#t:(\d+),(\d+),([^}]+)\}\}(\s*[^\{<]*?)(?=\{|<|$)/mg;
	colored_text = colored_text.replace(semicolons,
	  function (match, p1, p2, p3, p4, p5) {
	    return p1 + genericHandler(match, p2, p3, p4, p5);
	  }
	);

	// Need Wikipedia parser to do some work, too.
	var params = 'action=parse&format=json'
	    + '&title=' + encodeURIComponent(title)
	    + '&text='  + encodeURIComponent(colored_text);
	var apiUrl = getWikiAPI(loc);
log("posting to " + apiUrl);
	http_post(apiUrl, params,
	  function(req) {
	    try {
	      var json = JsonParser(req.responseText),
		  colored_text = json.parse.text['*'];
	      json = undefined;

	      // Fix edit section links
	      colored_text = colored_text.replace(/<span class="editsection"([^>]*)>(.*?) title="(.*?)">/g,
		function (match, one, two, three) {
		  three = three.replace(/\{\{#t:\d+,\d+,[^}]+\}\}/g, '');
		  return '<span class="editsection"'+one+'>'+two+' title="'+three+'">';
		}
	      );

	      // Fix trust tags with plain text after
	      var plaintxt = /\{\{#t:(\d+),(\d+),([^}]+)\}\}([^\{<]*)(?=\{\{#t|<|$)/g;
	      colored_text = colored_text.replace(plaintxt, genericHandler);

	      // And eliminate any remaining trust tags
	      colored_text = colored_text.replace(/\{\{#t:\d+,\d+,[^}]+\}\}/g, '');

	      // Fix ':click=' stuff to get around WpAPI cleanup
	      colored_text = colored_text.replace(/:click=/g, '" onclick="');

	      // Final step: share our data with original server
	      var url = getWikitrustAPI(loc);
	      url += 'RemoteAPI';
	      var params = 'method=sharehtml&revid=' + encodeURIComponent(revid)
		    + '&myhtml='  + encodeURIComponent(colored_text);
	      if (!debug) {
		// don't share if we are debugging
		http_post(url, params, function(req) {}, function(req) {});
	      }
	      return continuation(colored_text);
	    } catch (x) {
	      log('color_Wiki2HTML: ' + x);
	      return (failureFunc('Error processing WpAPI response', 'ErrWpAPI'))(null)
	    }
	  },
	    failureFunc('Unable to reach Wikipedia API', 'ErrWpAPI')
	);
      } catch (x) { log('color_Wiki2Html: ' + x); }
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
		if (/\/wiki\//.test(url))
		    add = true;
		if (/\/w\/index\.php/.test(url))
		    add = true;
		if (add)
		    url += sep + 'trust';
		node.setAttribute('HREF', url);
		if (/\?trust/.test(url) || /^#/.test(url)) {
		    // don't follow links if ctrl-alt is pressed
		    node.setAttribute('onclick', "return ahref(event);");
		}
	    }
        }
        var children = node.childNodes;
        for (var i=0; i<children.length; i++) {
            fixHrefs(children[i]);
        }
    }

    function addTrustHeaders(page) {
	var lang = getWikiLang(page.location);

	var css = page.createElement('link');
	css.setAttribute('rel', 'stylesheet');
	css.setAttribute('type', 'text/css');
	var url = 'http://'+ lang + getPrefStr('wtUrl', default_WtURL);
	url += 'css/trust.css';
	css.setAttribute('href', url);

	var script = page.createElement('script');
	var url = 'http://'+ lang + getPrefStr('wtUrl', default_WtURL);
	url += 'js/trust.js';
	script.setAttribute('src', url);

	var head = page.getElementsByTagName('head')[0];
	head.appendChild(css);
	head.appendChild(script);

if (FEATURE_TOOLTIP) {
	var tscript = page.createElement('script');
	var turl = 'http://'+ lang + getPrefStr('wtUrl', default_WtURL);
	turl += 'js/wz_tooltip.js';
	tscript.setAttribute('src', turl);
	head.appendChild(tscript);
}

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
	while (list.length > 0) {
	    var child = list.pop();
	    child.parentNode.removeChild(child);
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
	    // TODO: need to fix this to use modperl code
	    var lang = getWikiLang(page.location);
	    var url = 'http://'+ lang + getPrefStr('wtUrl', default_WtURL);
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
	var lang = getWikiLang(page.location);
	if (!isEnabledWiki(lang)) return null;

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
	trust_li.innerHTML = '<a href="' + articleURL
	    + '" title="' + getMsg(lang, 'tabhover') + '"><span>'
	    + getMsg(lang, 'tabtext') + '</span></a>';

	var co_menu = page.getElementById('ca-view');	// new style Wp pages
	if (!co_menu) co_menu = mainTab;		// fall back to old style
	var ul = co_menu.parentNode;
	ul.appendChild(trust_li);


if (FEATURE_VOTING) {
	var cite_li = page.getElementById('t-cite');
	if (!cite_li) return trust_li;	

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
}

	return trust_li;
    }

    function maybeColorPage(page, tab) {
	if (!tab) return;
	if (!/[?&]trust\b/.test(page.location.search)) return;
	addTrustHeaders(page);
	var wikiParams = getWikiParams(page);
	if (!wikiParams) return;
	var wtURL = getWikitrustAPI(loc);
	wtURL += 'RemoteAPI?method=wikiorhtml'
	    + '&title=' + encodeURIComponent(wikiParams[0])
	    + '&pageid=' + wikiParams[1]
	    + '&revid=' + wikiParams[2];
	if (debug) {
	  // always get wiki version if we are debugging
	  wtURL += '&debug=1';
	}
	tab.setAttribute('class', 'selected');
	var read_tab = page.getElementById('ca-view');
	if (read_tab) read_tab.setAttribute('class', '');

	var addedNodes = new Array();
	addedNodes.push(darkenPage(page));
	addedNodes.push(showDialog(page, getMsg(lang, 'downloadtrust'), 450,150));
	log("Requesting trust url = " + wtURL);
	var failureFunc = function (logmsg, msg) {
	    return function (req) {
	      try {
		log(logmsg);
		if (req) log('status = ' + req.status);
		removeExtras(addedNodes);
		var bodyContent = page.getElementById('bodyContent'),
		    box = getBoxedMsg(page, lang, msg);
		if (msg == 'ErrMsg')
		  box.innerHTML = box.innerHTML.replace('MSG', logmsg);
		if (bodyContent && box) {
		  bodyContent.insertBefore(box, bodyContent.firstChild);
		  var coords = page.getElementById('coordinates');
		  if (coords) coords.style.cssText = 'top: -20px !important';
		}
	      } catch (x) { log('failureFunc: ' + x); }
	    };
	}
	var displayFunc = function(txt) {
	  if (!txt)
	      return (failureFunc('No color info', 'ErrWpAPI'))(null);

	  removeExtras(addedNodes);
	  var trustDiv = page.createElement('div');
	  trustDiv.setAttribute('id', 'trust-div');

	  var bodyContent = page.getElementById('bodyContent'),
	      siteSub = page.getElementById('siteSub'),
	      contentSub = page.getElementById('contentSub'),
	      catlinks = page.getElementById('catlinks');
	  bodyContent.innerHTML = '';
	  bodyContent.appendChild(siteSub);
	  bodyContent.appendChild(contentSub);
	  bodyContent.appendChild(trustDiv);
	  if (catlinks) bodyContent.appendChild(catlinks);
	  trustDiv.innerHTML = txt;
	  fixHrefs(bodyContent);
	  var expl = getBoxedMsg(page, lang, 'success');
	  if (expl) bodyContent.insertBefore(expl, bodyContent.firstChild);
	  var coords = page.getElementById('coordinates');
	  if (coords) coords.style.cssText = 'top: -20px !important';
if (FEATURE_VOTING) {
	  var voteButton = page.getElementById('wt-vote-button');
	  addVotingHandler(page, voteButton);
}
	};
	http_get(wtURL, function (req) {
		log("http_get: "+wtURL);
		log("trust page downloaded successfully.");
		if (req.responseText == null)
		    return (failureFunc('Empty response', 'ErrBadTrust'))(req);
		try {
		    var responseType = req.responseText.substr(0,1);
		    if (responseType == 'H')
			return displayFunc(req.responseText.substr(1));
		    if (responseType == 'E') {
			var msg = req.responseText.substr(1);
			return (failureFunc(msg, 'ErrMsg'))(req);
		    }
		    if (responseType != 'W') {
			// Should be one of 'W' or 'H'
			log(req.responseText);
			return (failureFunc('Invalid response', 'ErrBadTrust'))(req);
		    }
		    if (req.responseText.indexOf("TEXT_NOT_FOUND")==1) {
			return (failureFunc('No text found', 'ErrNoTrust'))(req);
		    }
		    var comma = req.responseText.indexOf(',');
		    if (comma < 0) {
			log(req.responseText);
			return (failureFunc('No comma', 'ErrBadTrust'))(req);
		    }
		    var medianTrust = parseFloat(req.responseText.substr(1, comma-1)),
			colored_text = req.responseText.substr(comma+1),
			title = getTitleFUrl(page.location);
		    removeExtras(addedNodes);
		    addedNodes.push(darkenPage(page));
		    addedNodes.push(showDialog(page, getMsg(lang, 'downloadhtml'), 450,150));

		    color_Wiki2Html(page.location, lang, title, wikiParams[2], medianTrust, colored_text, displayFunc, failureFunc);
		} catch(x) { log('maybeColorPage: '+x); }
	    }, failureFunc('No response from server', 'ErrBadTrust'));
    }

    window.addEventListener("load", function(ev) {
	document.getElementById("appcontent").addEventListener(
		"DOMContentLoaded",
	    function(ev) {
		var tab, page = ev.originalTarget;
		if (page.nodeName != "#document") return;
		if (!page.location) return;

		log("DOMContentLoaded event for loc="+page.location);

		try {
		    tab = maybeAddTrustTab(page);
		    maybeColorPage(page, tab);
		} catch (e) {
		    log(e);
		};
	    }, false);
    }, false);
})();
