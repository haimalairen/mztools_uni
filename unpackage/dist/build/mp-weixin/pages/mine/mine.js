"use strict";const e=require("../../common/vendor.js"),o=require("../../utils/util.js");var t=getApp();const a={components:{},data:()=>({dailyFreeParseNum:"--",totalParseNum:"--",app:t,isLogin:t.globalData.checkIsLogin()}),onShow(){this.$forceUpdate()},methods:{onLoad:function(){},onShow:function(){this.isLogin&&this.getTotalParseNum(),this.getDailyFreeParseNum()},getUserInfo(o){if("getUserInfo:ok"!==o.detail.errMsg)return e.index.showToast({title:"未授权，登录失败",icon:"none"}),!1;e.index.showLoading({title:"正在登录",mask:!0}),t.globalData.getUserInfo((e=>{const{code:o,data:t}=e;200===o&&(this.isLogin=!0),this.$forceUpdate()}))},getDailyFreeParseNum(){var a,i=o.util.formatDate(new Date,"");e.index.getStorageSync("lastParseDate")!=i?(e.index.setStorageSync("lastParseDate",i),e.index.setStorageSync("dailyFreeParseNum",t.globalData.defaultDailyFreeParseNum),a=t.globalData.defaultDailyFreeParseNum):a=e.index.getStorageSync("dailyFreeParseNum"),console.log("app.globalData.",t.globalData.userInfo),this.dailyFreeParseNum=a},getTotalParseNum(){},showQrcode(){e.index.previewImage({urls:["http://photocq.photo.store.qq.com/psc?/V10npdo11GG6Tp/es2MkY2PTea.oVL6KUJJIFOSmcKTHd*Cuyf*6EvWFnIzJ.pRRfl1cROyN3XzE6b599JWHEkkwi6i4rHrpms87g!!/b&bo=kAEVAZABFQEDCC0!&rf=viewer_4"],current:"http://photocq.photo.store.qq.com/psc?/V10npdo11GG6Tp/es2MkY2PTea.oVL6KUJJIFOSmcKTHd*Cuyf*6EvWFnIzJ.pRRfl1cROyN3XzE6b599JWHEkkwi6i4rHrpms87g!!/b&bo=kAEVAZABFQEDCC0!&rf=viewer_4"})},handleEdit(){e.index.navigateTo({url:"/pages/mine/edit/edit"})}},created:function(){this.onShow()}};if(!Array){e.resolveComponent("uni-icons")()}Math;const i=e._export_sfc(a,[["render",function(o,t,a,i,r,s){return e.e({a:!r.isLogin},(r.isLogin,{}),{b:r.isLogin},r.isLogin?{c:e.o(((...e)=>s.handleEdit&&s.handleEdit(...e)))}:{},{d:!r.isLogin},r.isLogin?{f:r.app.globalData.userInfo.avatar}:{e:e.p({type:"contact",size:"50",color:"#ccc"})},{g:!r.isLogin},r.isLogin?{}:{h:e.o(((...e)=>s.getUserInfo&&s.getUserInfo(...e)))},{i:r.isLogin},r.isLogin?{j:e.t(r.app.globalData.userInfo.nickname)}:{},{k:e.t(r.dailyFreeParseNum),l:e.t(r.totalParseNum),m:e.p({type:"download-filled",size:"30",color:"#00c8fd"}),n:e.p({type:"right",size:"20",color:"#8a8a8a"}),o:e.p({type:"phone-filled",size:"30",color:"#00c8fd"}),p:e.p({type:"right",size:"20",color:"#8a8a8a"}),q:e.p({type:"redo-filled",size:"30",color:"#00c8fd"}),r:e.p({type:"right",size:"20",color:"#8a8a8a"}),s:e.p({type:"hand-up-filled",size:"30",color:"#00c8fd"}),t:e.p({type:"right",size:"20",color:"#8a8a8a"}),v:e.o(((...e)=>s.showQrcode&&s.showQrcode(...e)))})}]]);wx.createPage(i);
