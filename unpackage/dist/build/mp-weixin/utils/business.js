"use strict";const e=require("../common/vendor.js");function o(o){e.index.showLoading({title:"加载中"}),e.index.downloadFile({url:app.globalData.downLoadUrl,success:o=>{e.index.hideLoading(),200===o.statusCode&&e.index.saveImageToPhotosAlbum({filePath:o.tempFilePath,success:function(){e.index.showToast({title:"保存成功",icon:"none"})},fail:function(){e.index.showToast({title:"保存失败，请稍后重试",icon:"none"})}})},fail:o=>{e.index.showToast({title:"失败啦",icon:"none"})}})}function n(o){o.forEach((o=>{e.index.saveImageToPhotosAlbum({filePath:o,success:function(){e.index.showToast({title:"保存成功",icon:"none"})},fail:function(){console.log("保存失败：",o),e.index.showToast({title:"保存失败，请稍后重试",icon:"none"})}})}))}exports.initUserInfo=async function(o){const n=o||e.index.getStorageSync("token"),t=this.globalData?this.globalData:this;if(n){const{uid:o}=e.Bs.getCurrentUserInfo(),n=e.Bs.database(),s=await n.collection("uni-id-users").doc(o).field({nickname:!0,avatar:!0}).get(),{data:i}=s.result;if(console.log("userRecord:",i),i[0].nickname&&(t.userInfo.nickname=i[0].nickname),i[0].avatar){const e=i[0].avatar;t.userInfo.avatar=e}}},exports.saveImage2Photo=function(t,s){e.index.authorize({scope:"scope.writePhotosAlbum",success:()=>{({url:o,canvas:n})[t](s)},fail:()=>{e.index.getSetting({success:o=>{o.authSetting["scope.writePhotosAlbum"]||e.index.showModal({content:"由于您还没有允许保存图片到您相册里,无法进行保存,请点击确定允许授权",success:o=>{o.confirm&&e.index.openSetting({success:e=>{console.log(e.authSetting)}})}})}})}})};
