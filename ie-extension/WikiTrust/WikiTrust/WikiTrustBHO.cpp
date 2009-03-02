// WikiTrustBHO.cpp : Implementation of CWikiTrustBHO

#include "stdafx.h"
#include "WikiTrustBHO.h"


// CWikiTrustBHO

STDMETHODIMP CWikiTrustBHO::SetSite(IUnknown *pUnkSite)
{
	if (pUnkSite != NULL) {
		// Cache the pointer to IWebBrowser2
		pUnkSite->QueryInterface(IID_IWebBrowser2, (void**)&m_spWebBrowser);
	} else {
		// Release cached pointers and other resources here.
		m_spWebBrowser.Release();
	}

	// Return the base class implementation
	return IObjectWithSiteImpl<CWikiTrustBHO>::SetSite(pUnkSite);
}
