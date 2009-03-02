// WikiTrustBHO.h : Declaration of the CWikiTrustBHO

#pragma once

#include <shlguid.h>		// IID_IWebBrowser2, DIID_DWebBrowserEvents2, etc
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
	public IDispatchImpl<IWikiTrustBHO, &IID_IWikiTrustBHO, &LIBID_WikiTrustLib, /*wMajor =*/ 1, /*wMinor =*/ 0>
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

private:

	CComPtr<IWebBrowser2> m_spWebBrowser;
};

OBJECT_ENTRY_AUTO(__uuidof(WikiTrustBHO), CWikiTrustBHO)
