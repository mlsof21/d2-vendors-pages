(this["webpackJsonpreact-tutorial"]=this["webpackJsonpreact-tutorial"]||[]).push([[0],{34:function(e,t,n){},35:function(e,t,n){},36:function(e,t,n){},38:function(e,t,n){},50:function(e,t,n){},51:function(e,t,n){"use strict";n.r(t);var r=n(23),a=n.n(r),c=(n(34),n(16)),s=(n(35),n(14)),i=n(28),o=n(24),u=n.n(o),p=(n(36),n(1)),h=["text","noOverlay","className"];var f,l=function(e){var t=e.text,n=e.noOverlay,r=e.className,a=Object(i.a)(e,h),c=u()("Spinner",n&&"Spinner--noOverlay",r);return Object(p.jsxs)("div",Object(s.a)(Object(s.a)({},a),{},{className:c,children:[Object(p.jsx)("div",{className:"Spinner-spinner",children:Object(p.jsx)("svg",{viewBox:"0 0 64 64",children:Object(p.jsx)("circle",{transform:"translate(32,32)",r:"26"})})}),t?Object(p.jsx)("div",{className:"Spinner-content",children:t}):null]}))},b=n(0),d=n(9),m=n(12),v=n(13),j=n(18),O=n(15),g=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){return window.localStorage};Object(m.a)(this,e),this.storage=void 0,this.storage=t()}return Object(v.a)(e,[{key:"get",value:function(e){return this.storage.getItem(e)}},{key:"set",value:function(e,t){this.storage.setItem(e,t)}},{key:"clearItem",value:function(e){this.storage.removeItem(e)}},{key:"clearItems",value:function(e){var t=this;e.forEach((function(e){return t.clearItem(e)}))}}]),e}();!function(e){e.ALL_TOKENS="all_tokens"}(f||(f={}));var y=function(e){Object(j.a)(n,e);var t=Object(O.a)(n);function n(){return Object(m.a)(this,n),t.call(this)}return Object(v.a)(n,[{key:"setAllTokens",value:function(e){this.set(f.ALL_TOKENS,JSON.stringify(e))}},{key:"getAllTokens",value:function(){var e=this.get(f.ALL_TOKENS);return e?JSON.parse(e):null}},{key:"clear",value:function(){this.clearItems([f.ALL_TOKENS])}}],[{key:"getInstance",value:function(){return this.instance||(this.instance=new n),this.instance}}]),n}(g);y.instance=void 0;n(38);var x=function(){var e=y.getInstance().getAllTokens();return Object(p.jsxs)("div",{className:"navbar",children:[Object(p.jsx)(d.b,{to:"/",children:"Home"}),!e&&Object(p.jsx)(d.b,{to:"/login",children:"Login"}),e&&Object(p.jsx)(d.b,{to:"/vendors",children:"Vendors"})]})},k=n(4),w=n(2),I=n.n(w),S=n(3),T=n(27),_=n.n(T),N="07aedeb85a0441668d6755de78407538",E="38988",D="dBElXQcNpvR84zmqMTI0gPwo022Sdu.EXZhrxy.HVPo",L="https://mlsof21.github.io/d2-vendor-pages/callback",M="https://www.bungie.net/Platform";function P(){return F.apply(this,arguments)}function F(){return(F=Object(S.a)(I.a.mark((function e(){var t;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if((t=y.getInstance().getAllTokens())||y.getInstance().clear(),!(t&&!H(t.accessToken))){e.next=5;break}return e.abrupt("return",t);case 5:if(t&&!H(t.refreshToken)||console.log("We need to fetch a new token here"),e.prev=7,!t){e.next=12;break}return e.next=11,C(t.refreshToken);case 11:return e.abrupt("return",e.sent);case 12:throw new Error;case 15:throw e.prev=15,e.t0=e.catch(7),new Error("I dunno");case 18:case"end":return e.stop()}}),e,null,[[7,15]])})))).apply(this,arguments)}function A(e){return R.apply(this,arguments)}function R(){return(R=Object(S.a)(I.a.mark((function e(t){var n,r,a,c;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,P();case 2:if(n=e.sent){e.next=6;break}throw console.error("We need a new token"),new Error("Some token error");case 6:if(r={authorization:"Bearer ".concat(n.accessToken.value),"x-api-key":N},a=t.url,t.params){for(c in t.params)"undefined"===typeof t.params[c]&&delete t.params[c];a="".concat(a,"?").concat(new URLSearchParams(t.params).toString())}return console.log("Creating http client",{token:n}),console.log("Fetching from",t.url,"with headers",r,"body",t.body,"params",t.params),e.abrupt("return",fetch(a,{method:t.method,body:t.body,headers:r}).then((function(e){return e.json()})));case 12:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function B(e){return U.apply(this,arguments)}function U(){return(U=Object(S.a)(I.a.mark((function e(t){return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",fetch(t.url,{method:t.method,body:t.body}).then((function(e){return e.json()})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function J(e){var t=new URLSearchParams({grant_type:"authorization_code",code:e,client_id:E,client_secret:D});return fetch("".concat(M,"/app/oauth/token/"),{method:"POST",body:t}).then((function(e){return e.json()})).then(z).then((function(e){return y.getInstance().setAllTokens(e)}))}function z(e){if(null===e||void 0===e?void 0:e.access_token){var t=e,n=Date.now(),r={accessToken:{value:t.access_token,expires:t.expires_in,name:"access",inception:n},bungieMembershipId:t.membership_id};return t.refresh_token&&(r.refreshToken={value:t.refresh_token,expires:t.refresh_expires_in,name:"refresh",inception:n}),r}throw new Error("No tokens")}function C(e){var t=new URLSearchParams({grant_type:"refresh_token",refresh_token:e.value,client_id:E,client_secret:D});return Promise.resolve(fetch("".concat(M,"/app/oauth/token/"),{method:"POST",body:t,headers:{"Content-Type":"application/x-www-form-urlencoded"}}).then((function(e){return e.ok?e.json():Promise.reject(e)})).then(z).then((function(e){return y.getInstance().setAllTokens(e),e})))}function H(e){if(!e)return!0;var t=1e3*e.expires+e.inception;return Date.now()>t}n(50);var K=function(){var e=Object(k.g)();console.log("Using redirect",L);var t=function(){var t=Object(S.a)(I.a.mark((function t(n){var r;return I.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=n.code,console.log({code:r}),t.next=4,J(r);case 4:e.push("/");case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();return Object(p.jsx)(_.a,{authorizationUrl:"https://www.bungie.net/en/Oauth/Authorize",responseType:"code",clientId:E,redirectUri:L,onSuccess:t,onFailure:function(e){return console.log(e)},buttonText:"Login with Bungie.net Now",className:"loginButton"})};var V=function(){var e=new URLSearchParams(Object(k.h)().search).get("code");return Object(p.jsx)(p.Fragment,{children:!e&&Object(p.jsx)(p.Fragment,{children:e})})},W=n(53),X=n(54);function q(e){return Q.apply(this,arguments)}function Q(){return(Q=Object(S.a)(I.a.mark((function e(t){var n,r,a,c,s,i;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("Fetching membership info",t),e.next=3,Object(W.b)(A,{membershipId:t,membershipType:254,getAllMemberships:!0}).then((function(e){return e.Response}));case 3:return n=e.sent,r=n.profiles[0].membershipId,a=n.profiles[0].membershipType,e.next=8,Object(W.c)(A,{destinyMembershipId:r,components:[200],membershipType:a}).then((function(e){return e.Response}));case 8:return c=e.sent,s=Z(c),i={bungieMembershipId:t,destinyMembershipId:r,membershipType:a,hunterId:s.hunter,titanId:s.titan,warlockId:s.warlock},e.abrupt("return",i);case 12:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Z(e){var t=null,n=null,r=null;if(e.characters.data){var a=e.characters.data;Object.keys(e.characters.data).forEach((function(e){switch(a[e].classType){case 0:n=e;break;case 1:t=e;break;case 2:r=e;break;default:throw new Error("Unknown class type")}}))}return{hunter:t,titan:n,warlock:r}}function G(){return Y.apply(this,arguments)}function Y(){return(Y=Object(S.a)(I.a.mark((function e(){var t;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(W.a)(B);case 2:return t=e.sent,e.abrupt("return",t.Response);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function $(){return ee.apply(this,arguments)}function ee(){return(ee=Object(S.a)(I.a.mark((function e(){var t,n;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,G();case 2:return t=e.sent,e.next=5,Object(X.a)(B,{destinyManifest:t,language:"en",tableNames:["DestinyInventoryItemDefinition","DestinyStatDefinition"]});case 5:return n=e.sent,console.log({manifestSlice:n}),e.abrupt("return",n);case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var te,ne=n(29),re=Object(ne.a)("destiny2-store",1,{upgrade:function(e){e.createObjectStore("d2")}});function ae(e){return ce.apply(this,arguments)}function ce(){return(ce=Object(S.a)(I.a.mark((function e(t){return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,re;case 2:return e.abrupt("return",e.sent.get("d2",t));case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function se(e,t){return ie.apply(this,arguments)}function ie(){return(ie=Object(S.a)(I.a.mark((function e(t,n){return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,re;case 2:return e.abrupt("return",e.sent.put("d2",n,t));case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function oe(e){return ue.apply(this,arguments)}function ue(){return(ue=Object(S.a)(I.a.mark((function e(t){return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,se("DestinyInventoryItemDefinition",t.DestinyInventoryItemDefinition);case 2:return e.next=4,se("DestinyStatDefinition",t.DestinyStatDefinition);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function pe(){return he.apply(this,arguments)}function he(){return(he=Object(S.a)(I.a.mark((function e(){return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ae("DestinyStatDefinition");case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function fe(){return le.apply(this,arguments)}function le(){return(le=Object(S.a)(I.a.mark((function e(){return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ae("DestinyInventoryItemDefinition");case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(e){e.MEMBERSHIP_INFO="membership_info"}(te||(te={}));var be=function(e){Object(j.a)(n,e);var t=Object(O.a)(n);function n(){return Object(m.a)(this,n),t.call(this)}return Object(v.a)(n,[{key:"getMembershipInfo",value:function(){var e=this.get(te.MEMBERSHIP_INFO);if(e)return JSON.parse(e)}},{key:"setMembershipInfo",value:function(e){this.set(te.MEMBERSHIP_INFO,e)}}],[{key:"getInstance",value:function(){return this.instance||(this.instance=new n),this.instance}}]),n}(g);be.instance=void 0;var de=function(){var e=Object(k.g)(),t=Object(b.useState)(!0),n=Object(c.a)(t,2),r=n[0],a=n[1],s=y.getInstance(),i=be.getInstance(),o=s.getAllTokens(),u="";if(!o)return console.info("Redirecting to Login"),e.push("/Login"),Object(p.jsx)(p.Fragment,{});o&&(u=null===o||void 0===o?void 0:o.bungieMembershipId);var h=i.getMembershipInfo();function f(){return(f=Object(S.a)(I.a.mark((function e(){var t,n,r;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,pe();case 2:return t=e.sent,e.next=5,fe();case 5:if(n=e.sent,t&&n){e.next=18;break}return e.next=9,$();case 9:return r=e.sent,e.next=12,oe(r);case 12:return e.next=14,pe();case 14:return t=e.sent,e.next=17,fe();case 17:n=e.sent;case 18:if(h){e.next=23;break}return e.next=21,q(u);case 21:h=e.sent,i.setMembershipInfo(JSON.stringify(h));case 23:a(!1);case 24:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return Object(b.useEffect)((function(){!function(){f.apply(this,arguments)}()}),[]),r?Object(p.jsx)(p.Fragment,{children:"Loading User Info"}):Object(p.jsx)(p.Fragment,{children:"This is the home page"})};var me=function(){var e=Object(b.useState)(!1),t=Object(c.a)(e,2),n=t[0];return t[1],Object(p.jsxs)("div",{className:"App",children:[Object(p.jsx)(x,{}),Object(p.jsxs)(k.d,{children:[Object(p.jsx)(k.b,{exact:!0,path:"/login",component:K}),Object(p.jsx)(k.b,{exact:!0,path:"/callback",component:V}),Object(p.jsx)(k.b,{exact:!0,path:"/",component:de}),Object(p.jsx)(k.a,{to:"/"})]}),n&&Object(p.jsx)(l,{text:"Loading Destiny manifest",noOverlay:!1})]})},ve=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,55)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,c=t.getLCP,s=t.getTTFB;n(e),r(e),a(e),c(e),s(e)}))};a.a.render(Object(p.jsx)(d.a,{children:Object(p.jsx)(me,{})}),document.getElementById("root")),ve()}},[[51,1,2]]]);
//# sourceMappingURL=main.7b70504b.chunk.js.map