

/* this ALWAYS GENERATED file contains the definitions for the interfaces */


 /* File created by MIDL compiler version 7.00.0500 */
/* at Wed Mar 04 14:06:21 2009
 */
/* Compiler settings for .\WikiTrust.idl:
    Oicf, W1, Zp8, env=Win32 (32b run)
    protocol : dce , ms_ext, c_ext, robust
    error checks: stub_data 
    VC __declspec() decoration level: 
         __declspec(uuid()), __declspec(selectany), __declspec(novtable)
         DECLSPEC_UUID(), MIDL_INTERFACE()
*/
//@@MIDL_FILE_HEADING(  )

#pragma warning( disable: 4049 )  /* more than 64k source lines */


/* verify that the <rpcndr.h> version is high enough to compile this file*/
#ifndef __REQUIRED_RPCNDR_H_VERSION__
#define __REQUIRED_RPCNDR_H_VERSION__ 475
#endif

#include "rpc.h"
#include "rpcndr.h"

#ifndef __RPCNDR_H_VERSION__
#error this stub requires an updated version of <rpcndr.h>
#endif // __RPCNDR_H_VERSION__

#ifndef COM_NO_WINDOWS_H
#include "windows.h"
#include "ole2.h"
#endif /*COM_NO_WINDOWS_H*/

#ifndef __WikiTrust_i_h__
#define __WikiTrust_i_h__

#if defined(_MSC_VER) && (_MSC_VER >= 1020)
#pragma once
#endif

/* Forward Declarations */ 

#ifndef __IWikiTrustBHO_FWD_DEFINED__
#define __IWikiTrustBHO_FWD_DEFINED__
typedef interface IWikiTrustBHO IWikiTrustBHO;
#endif 	/* __IWikiTrustBHO_FWD_DEFINED__ */


#ifndef __WikiTrustBHO_FWD_DEFINED__
#define __WikiTrustBHO_FWD_DEFINED__

#ifdef __cplusplus
typedef class WikiTrustBHO WikiTrustBHO;
#else
typedef struct WikiTrustBHO WikiTrustBHO;
#endif /* __cplusplus */

#endif 	/* __WikiTrustBHO_FWD_DEFINED__ */


/* header files for imported files */
#include "oaidl.h"
#include "ocidl.h"

#ifdef __cplusplus
extern "C"{
#endif 


#ifndef __IWikiTrustBHO_INTERFACE_DEFINED__
#define __IWikiTrustBHO_INTERFACE_DEFINED__

/* interface IWikiTrustBHO */
/* [unique][helpstring][nonextensible][dual][uuid][object] */ 


EXTERN_C const IID IID_IWikiTrustBHO;

#if defined(__cplusplus) && !defined(CINTERFACE)
    
    MIDL_INTERFACE("4B067795-64CA-4922-A17E-ED9A41689B0F")
    IWikiTrustBHO : public IDispatch
    {
    public:
    };
    
#else 	/* C style interface */

    typedef struct IWikiTrustBHOVtbl
    {
        BEGIN_INTERFACE
        
        HRESULT ( STDMETHODCALLTYPE *QueryInterface )( 
            IWikiTrustBHO * This,
            /* [in] */ REFIID riid,
            /* [iid_is][out] */ 
            __RPC__deref_out  void **ppvObject);
        
        ULONG ( STDMETHODCALLTYPE *AddRef )( 
            IWikiTrustBHO * This);
        
        ULONG ( STDMETHODCALLTYPE *Release )( 
            IWikiTrustBHO * This);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfoCount )( 
            IWikiTrustBHO * This,
            /* [out] */ UINT *pctinfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfo )( 
            IWikiTrustBHO * This,
            /* [in] */ UINT iTInfo,
            /* [in] */ LCID lcid,
            /* [out] */ ITypeInfo **ppTInfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetIDsOfNames )( 
            IWikiTrustBHO * This,
            /* [in] */ REFIID riid,
            /* [size_is][in] */ LPOLESTR *rgszNames,
            /* [range][in] */ UINT cNames,
            /* [in] */ LCID lcid,
            /* [size_is][out] */ DISPID *rgDispId);
        
        /* [local] */ HRESULT ( STDMETHODCALLTYPE *Invoke )( 
            IWikiTrustBHO * This,
            /* [in] */ DISPID dispIdMember,
            /* [in] */ REFIID riid,
            /* [in] */ LCID lcid,
            /* [in] */ WORD wFlags,
            /* [out][in] */ DISPPARAMS *pDispParams,
            /* [out] */ VARIANT *pVarResult,
            /* [out] */ EXCEPINFO *pExcepInfo,
            /* [out] */ UINT *puArgErr);
        
        END_INTERFACE
    } IWikiTrustBHOVtbl;

    interface IWikiTrustBHO
    {
        CONST_VTBL struct IWikiTrustBHOVtbl *lpVtbl;
    };

    

#ifdef COBJMACROS


#define IWikiTrustBHO_QueryInterface(This,riid,ppvObject)	\
    ( (This)->lpVtbl -> QueryInterface(This,riid,ppvObject) ) 

#define IWikiTrustBHO_AddRef(This)	\
    ( (This)->lpVtbl -> AddRef(This) ) 

#define IWikiTrustBHO_Release(This)	\
    ( (This)->lpVtbl -> Release(This) ) 


#define IWikiTrustBHO_GetTypeInfoCount(This,pctinfo)	\
    ( (This)->lpVtbl -> GetTypeInfoCount(This,pctinfo) ) 

#define IWikiTrustBHO_GetTypeInfo(This,iTInfo,lcid,ppTInfo)	\
    ( (This)->lpVtbl -> GetTypeInfo(This,iTInfo,lcid,ppTInfo) ) 

#define IWikiTrustBHO_GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId)	\
    ( (This)->lpVtbl -> GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId) ) 

#define IWikiTrustBHO_Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr)	\
    ( (This)->lpVtbl -> Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr) ) 


#endif /* COBJMACROS */


#endif 	/* C style interface */




#endif 	/* __IWikiTrustBHO_INTERFACE_DEFINED__ */



#ifndef __WikiTrustLib_LIBRARY_DEFINED__
#define __WikiTrustLib_LIBRARY_DEFINED__

/* library WikiTrustLib */
/* [helpstring][version][uuid] */ 


EXTERN_C const IID LIBID_WikiTrustLib;

EXTERN_C const CLSID CLSID_WikiTrustBHO;

#ifdef __cplusplus

class DECLSPEC_UUID("E93BF2FC-CE71-433B-8B5A-1740C2930FA2")
WikiTrustBHO;
#endif
#endif /* __WikiTrustLib_LIBRARY_DEFINED__ */

/* Additional Prototypes for ALL interfaces */

/* end of Additional Prototypes */

#ifdef __cplusplus
}
#endif

#endif


