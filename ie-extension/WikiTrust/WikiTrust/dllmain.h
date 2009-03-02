// dllmain.h : Declaration of module class.

class CWikiTrustModule : public CAtlDllModuleT< CWikiTrustModule >
{
public :
	DECLARE_LIBID(LIBID_WikiTrustLib)
	DECLARE_REGISTRY_APPID_RESOURCEID(IDR_WIKITRUST, "{DE665979-ED3E-4313-AD25-F5480D38CA2D}")
};

extern class CWikiTrustModule _AtlModule;
