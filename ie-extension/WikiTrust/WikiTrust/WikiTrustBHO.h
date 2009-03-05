// WikiTrustBHO.h : Declaration of the CWikiTrustBHO

#pragma once

#include <shlguid.h>		// IID_IWebBrowser2, DIID_DWebBrowserEvents2, etc
#include <exdispid.h>		// DISPID_DOCUMENTCOMPLETE, etc.
#include <mshtml.h>			// DOM interfaces
#include "resource.h"       // main symbols

#include "WikiTrust_i.h"


#if defined(_WIN32_WCE) && !defined(_CE_DCOM) && !defined(_CE_ALLOW_SINGLE_THREADED_OBJECTS_IN_MTA)
#error "Single-threaded COM objects are not properly supported on Windows CE platform, such as the Windows Mobile platforms that do not include full DCOM support. Define _CE_ALLOW_SINGLE_THREADED_OBJECTS_IN_MTA to force ATL to support creating single-thread COM object's and allow use of it's single-threaded COM object implementations. The threading model in your rgs file was set to 'Free' as that is the only threading model supported in non DCOM Windows CE platforms."
#endif



// CWikiTrustBHO

class ATL_NO_VTABLE CWikiTrustBHO :
	public CComObjectRootEx<CComSingleThreadModel>,
	public CComCoClass<CWikiTrustBHO, &CLSID_WikiTrustBHO>,
	public IObjectWithSiteImpl<CWikiTrustBHO>,
	public IDispatchImpl<IWikiTrustBHO, &IID_IWikiTrustBHO, &LIBID_WikiTrustLib, /*wMajor =*/ 1, /*wMinor =*/ 0>,
	public IDispEventImpl<1, CWikiTrustBHO, &DIID_DWebBrowserEvents2, &LIBID_SHDocVw, 1, 1>
{
public:
	CWikiTrustBHO()
	{
	}

DECLARE_REGISTRY_RESOURCEID(IDR_WIKITRUSTBHO)

DECLARE_NOT_AGGREGATABLE(CWikiTrustBHO)

BEGIN_COM_MAP(CWikiTrustBHO)
	COM_INTERFACE_ENTRY(IWikiTrustBHO)
	COM_INTERFACE_ENTRY(IDispatch)
	COM_INTERFACE_ENTRY(IObjectWithSite)
END_COM_MAP()



	DECLARE_PROTECT_FINAL_CONSTRUCT()

	HRESULT FinalConstruct()
	{
		return S_OK;
	}

	void FinalRelease()
	{
	}

public:

	STDMETHOD(SetSite)(IUnknown *pUnkSite);

BEGIN_SINK_MAP(CWikiTrustBHO)
    SINK_ENTRY_EX(1, DIID_DWebBrowserEvents2, DISPID_DOCUMENTCOMPLETE, OnDocumentComplete)
    SINK_ENTRY_EX(1, DIID_DWebBrowserEvents2, DISPID_NAVIGATECOMPLETE2, OnNavigateComplete)
END_SINK_MAP()

    // DWebBrowserEvents2
    void STDMETHODCALLTYPE OnDocumentComplete(IDispatch *pDisp, VARIANT *pvarURL);
    void STDMETHODCALLTYPE OnNavigateComplete(IDispatch *pDisp, VARIANT *pvarURL);

private:
	void RemoveImages(IDispatch *pDocument);
	void addTrustHeaders(IHTMLDocument2 *pDocument);
	void addTrustTab();
	BOOL isWikipediaDomain(wchar_t *url);

private:

	CComPtr<IWebBrowser2> m_spWebBrowser;
	CComPtr<IServiceProvider> m_ServiceProvider;
	BOOL m_fAdvised;
};

OBJECT_ENTRY_AUTO(__uuidof(WikiTrustBHO), CWikiTrustBHO)
