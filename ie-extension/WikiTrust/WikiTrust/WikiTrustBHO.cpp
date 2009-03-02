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