(self.webpackChunkblog=self.webpackChunkblog||[]).push([[610],{23610:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return le}});n(74916),n(15306),n(64765),n(35666);var r=n(63804),a=n.n(r),o=n(84266),c=n(80051),l=n(39967),u=n(85344),i=n(96156),s=n(22122),f=n(94184),d=n.n(f),p=n(17375),m=n(28991),v=n(6610),y=n(5991),h=n(65255),b=n(54070),g=function(e){(0,h.Z)(n,e);var t=(0,b.Z)(n);function n(e){var r;(0,v.Z)(this,n),(r=t.call(this,e)).handleChange=function(e){var t=r.props,n=t.disabled,a=t.onChange;n||("checked"in r.props||r.setState({checked:e.target.checked}),a&&a({target:(0,m.Z)((0,m.Z)({},r.props),{},{checked:e.target.checked}),stopPropagation:function(){e.stopPropagation()},preventDefault:function(){e.preventDefault()},nativeEvent:e.nativeEvent}))},r.saveInput=function(e){r.input=e};var a="checked"in e?e.checked:e.defaultChecked;return r.state={checked:a},r}return(0,y.Z)(n,[{key:"focus",value:function(){this.input.focus()}},{key:"blur",value:function(){this.input.blur()}},{key:"render",value:function(){var e,t=this.props,n=t.prefixCls,r=t.className,o=t.style,c=t.name,l=t.id,u=t.type,f=t.disabled,m=t.readOnly,v=t.tabIndex,y=t.onClick,h=t.onFocus,b=t.onBlur,g=t.onKeyDown,k=t.onKeyPress,O=t.onKeyUp,x=t.autoFocus,C=t.value,E=t.required,Z=(0,p.Z)(t,["prefixCls","className","style","name","id","type","disabled","readOnly","tabIndex","onClick","onFocus","onBlur","onKeyDown","onKeyPress","onKeyUp","autoFocus","value","required"]),w=Object.keys(Z).reduce((function(e,t){return"aria-"!==t.substr(0,5)&&"data-"!==t.substr(0,5)&&"role"!==t||(e[t]=Z[t]),e}),{}),P=this.state.checked,j=d()(n,r,(e={},(0,i.Z)(e,"".concat(n,"-checked"),P),(0,i.Z)(e,"".concat(n,"-disabled"),f),e));return a().createElement("span",{className:j,style:o},a().createElement("input",(0,s.Z)({name:c,id:l,type:u,required:E,readOnly:m,disabled:f,tabIndex:v,className:"".concat(n,"-input"),checked:!!P,onClick:y,onFocus:h,onBlur:b,onKeyUp:O,onKeyDown:g,onKeyPress:k,onChange:this.handleChange,autoFocus:x,ref:this.saveInput,value:C},w)),a().createElement("span",{className:"".concat(n,"-inner")}))}}],[{key:"getDerivedStateFromProps",value:function(e,t){return"checked"in e?(0,m.Z)((0,m.Z)({},t),{},{checked:e.checked}):null}}]),n}(r.Component);g.defaultProps={prefixCls:"rc-checkbox",className:"",style:{},type:"checkbox",defaultChecked:!1,onFocus:function(){},onBlur:function(){},onChange:function(){},onKeyDown:function(){},onKeyPress:function(){},onKeyUp:function(){}};var k=g,O=n(85061),x=n(28481),C=n(98423),E=n(86032),Z=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]])}return n},w=r.createContext(null),P=function(e){var t=e.defaultValue,n=e.children,a=e.options,o=void 0===a?[]:a,c=e.prefixCls,l=e.className,u=e.style,f=e.onChange,p=Z(e,["defaultValue","children","options","prefixCls","className","style","onChange"]),m=r.useContext(E.E_),v=m.getPrefixCls,y=m.direction,h=r.useState(p.value||t||[]),b=(0,x.Z)(h,2),g=b[0],k=b[1],P=r.useState([]),j=(0,x.Z)(P,2),N=j[0],S=j[1];r.useEffect((function(){"value"in p&&k(p.value||[])}),[p.value]);var I=function(){return o.map((function(e){return"string"==typeof e?{label:e,value:e}:e}))},A=v("checkbox",c),L="".concat(A,"-group"),D=(0,C.Z)(p,["value","disabled"]);o&&o.length>0&&(n=I().map((function(e){return r.createElement(K,{prefixCls:A,key:e.value.toString(),disabled:"disabled"in e?e.disabled:p.disabled,value:e.value,checked:-1!==g.indexOf(e.value),onChange:e.onChange,className:"".concat(L,"-item"),style:e.style},e.label)})));var F={toggleOption:function(e){var t=g.indexOf(e.value),n=(0,O.Z)(g);if(-1===t?n.push(e.value):n.splice(t,1),"value"in p||k(n),f){var r=I();f(n.filter((function(e){return-1!==N.indexOf(e)})).sort((function(e,t){return r.findIndex((function(t){return t.value===e}))-r.findIndex((function(e){return e.value===t}))})))}},value:g,disabled:p.disabled,name:p.name,registerValue:function(e){S((function(t){return[].concat((0,O.Z)(t),[e])}))},cancelValue:function(e){S((function(t){return t.filter((function(t){return t!==e}))}))}},R=d()(L,(0,i.Z)({},"".concat(L,"-rtl"),"rtl"===y),l);return r.createElement("div",(0,s.Z)({className:R,style:u},D),r.createElement(w.Provider,{value:F},n))},j=r.memo(P),N=n(21687),S=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]])}return n},I=function(e,t){var n,a=e.prefixCls,o=e.className,c=e.children,l=e.indeterminate,u=void 0!==l&&l,f=e.style,p=e.onMouseEnter,m=e.onMouseLeave,v=e.skipGroup,y=void 0!==v&&v,h=S(e,["prefixCls","className","children","indeterminate","style","onMouseEnter","onMouseLeave","skipGroup"]),b=r.useContext(E.E_),g=b.getPrefixCls,O=b.direction,x=r.useContext(w),C=r.useRef(h.value);r.useEffect((function(){null==x||x.registerValue(h.value),(0,N.Z)("checked"in h||!!x||!("value"in h),"Checkbox","`value` is not a valid prop, do you mean `checked`?")}),[]),r.useEffect((function(){if(!y)return h.value!==C.current&&(null==x||x.cancelValue(C.current),null==x||x.registerValue(h.value)),function(){return null==x?void 0:x.cancelValue(h.value)}}),[h.value]);var Z=g("checkbox",a),P=(0,s.Z)({},h);x&&!y&&(P.onChange=function(){h.onChange&&h.onChange.apply(h,arguments),x.toggleOption&&x.toggleOption({label:c,value:h.value})},P.name=x.name,P.checked=-1!==x.value.indexOf(h.value),P.disabled=h.disabled||x.disabled);var j=d()((n={},(0,i.Z)(n,"".concat(Z,"-wrapper"),!0),(0,i.Z)(n,"".concat(Z,"-rtl"),"rtl"===O),(0,i.Z)(n,"".concat(Z,"-wrapper-checked"),P.checked),(0,i.Z)(n,"".concat(Z,"-wrapper-disabled"),P.disabled),n),o),I=d()((0,i.Z)({},"".concat(Z,"-indeterminate"),u));return r.createElement("label",{className:j,style:f,onMouseEnter:p,onMouseLeave:m},r.createElement(k,(0,s.Z)({},P,{prefixCls:Z,className:I,ref:t})),void 0!==c&&r.createElement("span",null,c))},A=r.forwardRef(I);A.displayName="Checkbox";var K=A,L=K;L.Group=j,L.__ANT_CHECKBOX=!0;var D=L,F=n(82482),R=n(55026),M=n(39668),V=n(66132),_=n(71230),B=n(15746),q=n(71577),z={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"}}]},name:"github",theme:"outlined"},G=n(30076),U=function(e,t){return r.createElement(G.Z,Object.assign({},e,{ref:t,icon:z}))};U.displayName="GithubOutlined";var T=r.forwardRef(U),H=n(80129),$=n(95325),Q=n(37046),W=n(847);function X(){return(X=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function J(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function Y(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?J(Object(n),!0).forEach((function(t){ee(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):J(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function ee(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function te(e,t,n,r,a,o,c){try{var l=e[o](c),u=l.value}catch(e){return void n(e)}l.done?t(u):Promise.resolve(u).then(r,a)}function ne(e){return function(){var t=this,n=arguments;return new Promise((function(r,a){var o=e.apply(t,n);function c(e){te(o,r,a,c,l,"next",e)}function l(e){te(o,r,a,c,l,"throw",e)}c(void 0)}))}}function re(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],r=!0,a=!1,o=void 0;try{for(var c,l=e[Symbol.iterator]();!(r=(c=l.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){a=!0,o=e}finally{try{r||null==l.return||l.return()}finally{if(a)throw o}}return n}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return ae(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return ae(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function ae(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var oe={labelCol:{span:5},wrapperCol:{span:16}},ce={wrapperCol:{offset:5,span:16}},le=(0,r.memo)((function(){var e,t=(0,W.useHistory)(),n=(0,$.useDispatch)(),i=re(F.Z.useForm(),1)[0],s=(0,$.useSelector)((function(e){return e.user})),f=re((0,c._)(o.m.BLOG_STORE_ACCOUNT),2),d=f[0],p=f[1],m=re((0,c.G2)(l.zA.k_),4),v=m[1],y=m[3],h=(0,r.useCallback)((function(){var e=(0,H.parse)(location.search,{ignoreQueryPrefix:!0}).redirect;e?window.location.href=Array.isArray(e)?e[0]:e:t.replace("/center")}),[t]),b=(0,r.useCallback)((function(){i.validateFields().then(function(){var e=ne(regeneratorRuntime.mark((function e(t){var r,a,o,c,i,s,f,d,m,v,y,b,g,k;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.password,o=t.autoLogin,c=t.captcha,R.ZP.loading({content:"正在登录...",key:"login",duration:0}),e.next=4,l.zA.Sw(c);case 4:if(i=e.sent,s=re(i,2),!s[1]){e.next=10;break}return R.ZP.error({content:"验证码错误",key:"login"}),e.abrupt("return");case 10:return e.next=12,l.zA.$3();case 12:if(f=e.sent,d=re(f,2),m=d[0],!d[1]&&null!=m&&null!==(r=m.data)&&void 0!==r&&r.item){e.next=19;break}return R.ZP.error({content:"登录失败",key:"login"}),e.abrupt("return");case 19:return v=(0,u.jm)((0,u.qC)(a),m.data.item),e.next=22,l.zA.x4(Y(Y({},t),{},{password:v}));case 22:if(y=e.sent,b=re(y,2),g=b[0],!(k=b[1])){e.next=29;break}return R.ZP.error({content:k.message||"登录失败",key:"login"}),e.abrupt("return");case 29:R.ZP.success({content:"登录成功",key:"login"}),p({autoLogin:o,autoLoginMark:o}),n((0,Q.x)(g.data)),h();case 33:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()).catch((function(){R.ZP.error("请检查表单是否填写无误")}))}),[i,n,h,p]);return(0,r.useEffect)((function(){if(null!=s&&s.account)return h();ne(regeneratorRuntime.mark((function e(){var t,r,a,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.zA.x4({autoLogin:!0});case 2:if(r=e.sent,a=re(r,1),null!=(o=a[0])&&null!==(t=o.data)&&void 0!==t&&t.account){e.next=7;break}return e.abrupt("return");case 7:n((0,Q.x)(o.data)),h();case 9:case"end":return e.stop()}}),e)})))()}),[s,n,h]),a().createElement("div",{style:{minHeight:"100vh",background:"#f0f2f5",display:"flex",justifyContent:"center",alignItems:"center"}},a().createElement(M.Z,{style:{width:500}},a().createElement("div",{className:"mt15 mb20",style:{display:"flex",justifyContent:"center",alignItems:"center"}},a().createElement("img",{src:"".concat("","/public/assets/images/logo.png"),style:{width:40,height:40,borderRadius:"50%"}}),a().createElement("span",{style:{fontSize:36,fontWeight:"bold",marginLeft:16}},"briefNull")),a().createElement(F.Z,X({},oe,{form:i,name:"login",initialValues:{autoLogin:Boolean(null==d?void 0:d.autoLogin)}}),a().createElement(F.Z.Item,{label:"Account",name:"account",rules:[{required:!0,message:"Please input your account!"}]},a().createElement(V.Z,null)),a().createElement(F.Z.Item,{label:"Password",name:"password",rules:[{required:!0,message:"Please input your password!"}]},a().createElement(V.Z.Password,null)),a().createElement(F.Z.Item,{label:"Captcha"},a().createElement(_.Z,{gutter:8},a().createElement(B.Z,{span:18},a().createElement(F.Z.Item,{noStyle:!0,name:"captcha",rules:[{required:!0,message:"Please input captcha!"}]},a().createElement(V.Z,{placeholder:"captcha"}))),a().createElement(B.Z,{span:6},a().createElement("img",{alt:"验证码",src:(null==v||null===(e=v.data)||void 0===e?void 0:e.item)&&"data:image/png;base64,".concat(v.data.item),style:{height:31,width:"100%",border:"1px solid gray",padding:3,cursor:"pointer"},onClick:y})))),a().createElement(F.Z.Item,X({},ce,{name:"autoLogin",valuePropName:"checked"}),a().createElement(D,null,"Remember me")),a().createElement(F.Z.Item,ce,a().createElement(q.Z,{block:!0,type:"primary",onClick:b},"登录")),a().createElement(F.Z.Item,ce,a().createElement(_.Z,null,a().createElement(B.Z,{span:14},"其他方式",a().createElement(T,{className:"font24 ml10 pointer"})),a().createElement(B.Z,{span:10,className:"text-right"},a().createElement(W.Link,{to:"/register"},"注册账户")))))))}))}}]);
//# sourceMappingURL=610.js.map