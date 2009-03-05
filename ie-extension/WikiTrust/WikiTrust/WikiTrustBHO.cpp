// WikiTrustBHO.cpp : Implementation of CWikiTrustBHO

#include "stdafx.h"
#include "WikiTrustBHO.h"


// CWikiTrustBHO

STDMETHODIMP CWikiTrustBHO::SetSite(IUnknown *pUnkSite)
{
	if (pUnkSite != NULL) {
		m_spWebBrowser = NULL;
		m_fAdvised = FALSE;
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




    // Query for the IWebBrowser2 interface.
    CComQIPtr<IWebBrowser2> spTempWebBrowser = pDisp;

	// Is this event associated with the top-level browser?
	if (!spTempWebBrowser || !m_spWebBrowser ||
		!m_spWebBrowser.IsEqualObject(spTempWebBrowser))
		return;
	// Get the current document object from browser...
	CComPtr<IDispatch> spDispDoc;
	hr = m_spWebBrowser->get_Document(&spDispDoc);
	if (!SUCCEEDED(hr))
		return;

	// ...and query for an HTML document.


	addTrustTab(spDispDoc);

	// Finally, remove the images.
	RemoveImages(spDispDoc);
}

void STDMETHODCALLTYPE CWikiTrustBHO::OnNavigateComplete(IDispatch *pDisp, VARIANT *pvarURL)
{
#if 1
    HRESULT hr = S_OK;
#else
    HWND hwnd;
    HRESULT hr = m_spWebBrowser->get_HWND((LONG_PTR*)&hwnd);
    if (SUCCEEDED(hr))
    {
		BSTR url = pvarURL->bstrVal;
        // Output a message box when page is loaded.
        MessageBox(hwnd, url, L"WikiTrust", MB_OK);
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

void CWikiTrustBHO::addTrustTab(IDispatch* pDocument)
{
	CComQIPtr<IHTMLDocument2> spHTML2Doc = pDocument;
	if (!spHTML2Doc)
		return;
	CComQIPtr<IHTMLDocument3> spHTML3Doc = pDocument;
	if (!spHTML3Doc)
		return;

	IHTMLElement *mainTab = NULL;
	HRESULT hr = spHTML3Doc->getElementById(L"ca-nstab-main", &mainTab);
	if (!SUCCEEDED(hr)) return;
	if (!mainTab)
		return;
	VARIANT	var;
	hr = mainTab->getAttribute(L"className", 0, &var);
	if (!SUCCEEDED(hr)) return;
	if (!var.bstrVal)
		return;
	if (wcsncmp(var.bstrVal, L"selected", 8) != 0)
		return;
	//
#if 0
	CComBSTR test = L"my test";
	mainTab->put_innerHTML(test);
#endif
	//
	IHTMLElement *trust_li = NULL;
	hr = spHTML2Doc->createElement(L"li", &trust_li);
	if (!SUCCEEDED(hr)) return;
	if (!trust_li)
		return;
	CComBSTR anchor = L"<a href='/wiki/";
	anchor += L"Foobar";			// TODO: should be article title
	anchor += L"' title='Trust colored version of this page'>trust info</a>";
	trust_li->put_innerHTML(anchor);
	IHTMLDOMNode *mainTabDOM;
	hr = mainTab->QueryInterface(IID_IHTMLDOMNode, (LPVOID*) &mainTabDOM);
	if (!SUCCEEDED(hr)) return;
	IHTMLDOMNode *trust_liDOM1 = NULL;
	IHTMLDOMNode *trust_liDOM2 = NULL;
	hr = trust_li->QueryInterface(IID_IHTMLDOMNode, (LPVOID*) &trust_liDOM1);
	if (!SUCCEEDED(hr)) return;
	IHTMLDOMNode *ulDOM;
	hr = mainTabDOM->get_parentNode(&ulDOM);
	if (!SUCCEEDED(hr)) return;
	hr = ulDOM->appendChild(trust_liDOM1, &trust_liDOM2);
	if (!SUCCEEDED(hr)) return;
}

void CWikiTrustBHO::addTrustHeaders(IHTMLDocument2* pDocument)
{
		static const CComBSTR style(L".trust0 {\n"
            L"background-color:#FFB947;\n"
            L"}\n"
            L".trust1 {\n"
            L"background-color:#FFC05C;\n"
            L"}\n"
            L".trust2 {\n"
            L"background-color:#FFC870;\n"
            L"}\n"
            L".trust3 {\n"
            L"background-color:#FFD085;\n"
            L"}\n"
            L".trust4 {\n"
            L"background-color:#FFD899;\n"
            L"}\n"
            L".trust5 {\n"
            L"background-color:#FFE0AD;\n"
            L"}\n"
            L".trust6 {\n"
            L"background-color:#FFE8C2;\n"
            L"}\n"
            L".trust7 {\n"
            L"background-color:#FFEFD6;\n"
            L"}\n"
            L".trust8 {\n"
            L"background-color:#FFF7EB;\n"
            L"}\n"
            L".trust9 {\n"
            L"background-color:#FFFFFF;\n"
            L"}\n"
            L".trust10 {\n"
            L"background-color:#FFFFFF;\n"
            L"}\n");
	CComPtr<IHTMLStyleSheet> css;
	pDocument->createStyleSheet(NULL,0,&css);
	css->put_cssText(style);
}

void CWikiTrustBHO::RemoveImages(IDispatch* pDocument)
{
	CComQIPtr<IHTMLDocument2> spHTML2Doc = pDocument;
	if (!spHTML2Doc)
		return;
    CComPtr<IHTMLElementCollection> spImages;

    // Get the collection of images from the DOM.
    HRESULT hr = spHTML2Doc->get_images(&spImages);
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