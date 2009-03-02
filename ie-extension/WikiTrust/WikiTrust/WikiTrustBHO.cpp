// WikiTrustBHO.cpp : Implementation of CWikiTrustBHO

#include "stdafx.h"
#include "WikiTrustBHO.h"


// CWikiTrustBHO

STDMETHODIMP CWikiTrustBHO::SetSite(IUnknown *pUnkSite)
{
	if (pUnkSite != NULL) {
		// Cache the pointer to IWebBrowser2
		HRESULT hr = pUnkSite->QueryInterface(IID_IWebBrowser2, (void**)&m_spWebBrowser);
		if (SUCCEEDED(hr)) {
			// Register to sink events from DWebBrowserEvents2.
            hr = DispEventAdvise(m_spWebBrowser);
            if (SUCCEEDED(hr))
                m_fAdvised = TRUE;
		}
	} else {
		if (m_fAdvised) {
			DispEventUnadvise(m_spWebBrowser);
			m_fAdvised = FALSE;
		}

		// Release cached pointers and other resources here.
		m_spWebBrowser.Release();
	}

	// Return the base class implementation
	return IObjectWithSiteImpl<CWikiTrustBHO>::SetSite(pUnkSite);
}

#if 0
void STDMETHODCALLTYPE CWikiTrustBHO::OnDocumentComplete(IDispatch *pDisp, VARIANT *pvarURL)
{
    // Retrieve the top-level window from the site.
    HWND hwnd;
    HRESULT hr = m_spWebBrowser->get_HWND((LONG_PTR*)&hwnd);
    if (SUCCEEDED(hr))
    {
        // Output a message box when page is loaded.
        MessageBox(hwnd, L"Hello World!", L"BHO", MB_OK);
    }
}
#endif

void STDMETHODCALLTYPE CWikiTrustBHO::OnDocumentComplete(IDispatch *pDisp, VARIANT *pvarURL)
{
    HRESULT hr = S_OK;
	BSTR url = pvarURL->bstrVal;
	if (!url || wcsncmp(url, L"http://", 7)!= 0)
		return;
	wchar_t *domain = wcsstr(url+7, L"en.wikipedia.org");
	if (!domain)
		return;

	CComBSTR jcode = L"
    function async_get(path, success, failure) {
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
        request.send(null);
    };

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

    function getWikiLang(loc) {
        var dom = loc.host.indexOf('.wikipedia.org');
        if (dom < 0) return null;
        else return loc.host.substr(0, dom);
    }

    var fakeURL = 'http://cloud-master.xurch.com/tmp/olwen.xml';
   function getWikiTrustURL(loc) {
        if (/&diff=/.test(loc.search)) return null;
        if (/&action=/.test(loc.search)) return null;
        // return fakeURL;
        var title = getQueryVariable(loc.search, 'title');
        if (title == '') {
            var match = /^\/wiki\/(.*)$/.exec(loc.pathname);
            title = match[1];
        }
        if (title == '') {
            var match = /^\/w\/index\.php\/(.*)$/.exec(loc.pathname);
            title = match[1];
        }
        var revID = getQueryVariable(loc.search, 'oldid');
        if (revID == '') revID = getQueryVariable(loc.search, 'diff');

        if (revID == '' && title == '') {
            return null;
        }
        var url = 'http://redherring.cse.ucsc.edu/firefox/frontend/index.php?action=ajax&rs=TextTrustImpl::getColoredText&rsargs[]=' + escape(title) + '&rsargs[]=&rsargs[]=' + revID;
        return url;
    }
    function getStrippedURL(loc) {
        return loc.pathname + loc.search;
    }

    function getTrustURL(loc) {
        if (/[\?&]trust/.test(loc.search)) return loc.href;
        var url = getStrippedURL(loc);
        if (/\?/.test(url)) return url + '&trust';
        else return url + '?trust';
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
    function addTrustHeaders(page) {
        var css = page.createElement('style');
        //css.setAttribute('type', 'text/css');
        css.innerHTML= ".trust0 {\n"
            + "background-color:#FFB947;\n"
            + "}\n"
            + ".trust1 {\n"
            + "background-color:#FFC05C;\n"
            + "}\n"
            + ".trust2 {\n"
            + "background-color:#FFC870;\n"
            + "}\n"
            + ".trust3 {\n"
            + "background-color:#FFD085;\n"
            + "}\n"
            + ".trust4 {\n"
            + "background-color:#FFD899;\n"
            + "}\n"
            + ".trust5 {\n"
            + "background-color:#FFE0AD;\n"
            + "}\n"
            + ".trust6 {\n"
            + "background-color:#FFE8C2;\n"
            + "}\n"
            + ".trust7 {\n"
            + "background-color:#FFEFD6;\n"
            + "}\n"
            + ".trust8 {\n"
            + "background-color:#FFF7EB;\n"
            + "}\n"
            + ".trust9 {\n"
            + "background-color:#FFFFFF;\n"
            + "}\n"
            + ".trust10 {\n"
            + "background-color:#FFFFFF;\n"
            + "}\n";

        var script = page.createElement('script');
        script.innerHTML = 'function showOrigin(revnum) { document.location.href = "/w/index.php?title=" + wgPageName + "&oldid=" + revnum; }';

        var head = page.getElementsByTagName('head')[0];
        head.appendChild(css);
        head.appendChild(script);

        var tooltipURL = 'http://redherring.cse.ucsc.edu/firefox/frontend/extensions/Trust/js/wz_tooltip.js';
        // var tooltipURL = 'http://www.soe.ucsc.edu/~thumper//wz_tooltip.js';
        log("Requesting tooltip url = " + tooltipURL);
        async_get(tooltipURL,
            function (req) {
                var script = page.createElement('script');
                script.innerHTML = req.responseText;
                head.appendChild(script);
            },
            function (req) {
                log("ERROR downloading tooltip code, status = " + req.status);
            });
        return null;
    }

    function max(a,b) { return (a > b) ? a : b; }

    function removeExtras(list){
        for (var i in list) {
            list[i].parentNode.removeChild(list[i]);
        }
    }

    function maybeAddTrustTab(page) {
        var lang = getWikiLang(page.location);
        if (!lang) return null;
        log("lang = " + lang);

        var mainTab = page.getElementById('ca-nstab-main');
        if (!mainTab) return null;              // must not be a main article!
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
        var trust_li = page.createElement('li');
        trust_li.setAttribute("id", "ca-trust");
        trust_li.innerHTML = '<a href="'
            + articleURL + '" title="Trust colored version of this page">'
            + 'trust info</a>';

        var ul = mainTab.parentNode;
        ul.appendChild(trust_li);

        var cite_li = page.getElementById('t-cite');
        if (!cite_li) return null;

        var revID = getQueryVariable(page.location.search, 'oldid');
        if (revID == '') revID = getQueryVariable(page.location.search, 'diff');
        var vote_a = page.createElement('a');
        vote_a.href = '#voted';
        vote_a.innerHTML ='Vote for this page';
        var clickHandler = function (e) {
                vote_a.innerHTML = 'Voting...';
                wgUserName = window.content.wrappedJSObject.wgUserName;
                if (wgUserName == null) wgUserName = '';
                var wgArticleId = window.content.wrappedJSObject.wgArticleId;
                var wgPageName = window.content.wrappedJSObject.wgPageName;
                var wgCurRevisionId = window.content.wrappedJSObject.wgCurRevisionId;
                if (revID == '') revID = wgCurRevisionId;
                var url = 'http://redherring.cse.ucsc.edu/firefox/frontend/index.php?action=ajax&rs=TextTrustImpl::handleVote&rsargs[]='+escape(wgUserName)+'&rsargs[]=' + wgArticleId + '&rsargs[]=' + revID + '&rsargs[]=' + escape(wgPageName);
                log("voting url: " + url);
                async_get(url,
                    function (req) {
                        vote_a.innerHTML = 'Thanks for voting!'
                        log("Voting request text: " + req.responseText);
                        vote_a.click = null;
                    },
                    function (req) {
                        vote_a.innerHTML = 'Voting error.';
                        log("Voting request status: " + req.status);
                        log("Voting request text: " + req.responseText);
                        vote_a.click = null;
                    });
                return false;
            };
        vote_a.addEventListener("click", clickHandler, false);
        var vote_li = page.createElement('li');
        vote_li.setAttribute('id', 't-vote');
        vote_li.appendChild(vote_a);

        ul = cite_li.parentNode;
        ul.appendChild(vote_li);

        return trust_li;
    }
    function maybeColorPage(page, tab) {
        if (!tab) return;
        addTrustHeaders(page);
        if (!/[\?&]trust$/.test(page.location.search)) return;
        tab.setAttribute('class', 'selected');
        var addedNodes = new Array();
        addedNodes.push(darkenPage(page));
        addedNodes.push(showDialog(page,
                "<p>Downloading trust information...</p>", 300,100));
        var wtURL = getWikiTrustURL(page.location);
        log("Requesting trust url = " + wtURL);
        var content = page.getElementById('content');
        async_get(wtURL,
            function (req) {
                log("trust page downloaded successfully.");
                removeExtras(addedNodes);
                content.innerHTML = '';
                if (req.responseXML != null) {
                    var trustContent = req.responseXML.getElementsByTagName('trustdata')[0].firstChild.nodeValue;
                    content.innerHTML = trustContent;
                } else if (req.responseText != null) {
                    content.innerHTML = req.responseText;
                }
            },
            function (req) {
                log("trust page failed to download, status = " + req.status);
                removeExtras(addedNodes);
                addedNodes.push(darkenPage(page));
                addedNodes.push(showDialog(page,
                    "<p>Failed to contact trust server...</p>", 300,100));
            });
    }

	var tab = maybeAddTrustTab(document);
	maybeColorPage(document, tab);

	";




    // Query for the IWebBrowser2 interface.
    CComQIPtr<IWebBrowser2> spTempWebBrowser = pDisp;

    // Is this event associated with the top-level browser?
    if (spTempWebBrowser && m_spWebBrowser &&
        m_spWebBrowser.IsEqualObject(spTempWebBrowser))
    {
        // Get the current document object from browser...
        CComPtr<IDispatch> spDispDoc;
        hr = m_spWebBrowser->get_Document(&spDispDoc);
        if (SUCCEEDED(hr))
        {
            // ...and query for an HTML document.
            CComQIPtr<IHTMLDocument2> spHTMLDoc = spDispDoc;
            if (spHTMLDoc != NULL)
            {
                // Finally, remove the images.
                RemoveImages(spHTMLDoc);
            }
        }
    }
}

void STDMETHODCALLTYPE CWikiTrustBHO::OnNavigateComplete(IDispatch *pDisp, VARIANT *pvarURL)
{
#if 0
    HRESULT hr = S_OK;
#else
    HWND hwnd;
    HRESULT hr = m_spWebBrowser->get_HWND((LONG_PTR*)&hwnd);
    if (SUCCEEDED(hr))
    {
		BSTR url = pvarURL->bstrVal;
        // Output a message box when page is loaded.
        MessageBox(hwnd, url, L"BHO", MB_OK);
    }
#endif

    // Query for the IWebBrowser2 interface.
    CComQIPtr<IWebBrowser2> spTempWebBrowser = pDisp;

    // Is this event associated with the top-level browser?
    if (spTempWebBrowser && m_spWebBrowser &&
        m_spWebBrowser.IsEqualObject(spTempWebBrowser))
    {
        // Get the current document object from browser...
        CComPtr<IDispatch> spDispDoc;
        hr = m_spWebBrowser->get_Document(&spDispDoc);
        if (SUCCEEDED(hr))
        {
            // ...and query for an HTML document.
            CComQIPtr<IHTMLDocument2> spHTMLDoc = spDispDoc;
            if (spHTMLDoc != NULL)
            {
                // Finally, remove the images.
                RemoveImages(spHTMLDoc);
            }
        }
    }
}
void CWikiTrustBHO::RemoveImages(IHTMLDocument2* pDocument)
{
    CComPtr<IHTMLElementCollection> spImages;

    // Get the collection of images from the DOM.
    HRESULT hr = pDocument->get_images(&spImages);
    if (hr == S_OK && spImages != NULL)
    {
        // Get the number of images in the collection.
        long cImages = 0;
        hr = spImages->get_length(&cImages);
        if (hr == S_OK && cImages > 0)
        {
            for (int i = 0; i < cImages; i++)
            {
                CComVariant svarItemIndex(i);
                CComVariant svarEmpty;
                CComPtr<IDispatch> spdispImage;

                // Get the image out of the collection by index.
                hr = spImages->item(svarItemIndex, svarEmpty, &spdispImage);
                if (hr == S_OK && spdispImage != NULL)
                {
                    // First, query for the generic HTML element interface...
                    CComQIPtr<IHTMLElement> spElement = spdispImage;

                    if (spElement)
                    {
                        // ...then ask for the style interface.
                        CComPtr<IHTMLStyle> spStyle;
                        hr = spElement->get_style(&spStyle);

                        // Set display="none" to hide the image.
                        if (hr == S_OK && spStyle != NULL)
                        {
                            static const CComBSTR sbstrNone(L"none");
                            spStyle->put_display(sbstrNone);
                        }
                    }
                }
            }
        }
    }
}