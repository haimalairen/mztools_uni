"use strict";const e=require("../../../common/vendor.js"),s=require("../../../config.js"),t=require("../../../utils/unicloud-co-task.js"),i=require("./SliceMsgToLastMsg.js");let n=[];n.clear=function(){n.forEach((e=>e.abort())),n.slice(0,n.length)};const{adpid:o}=s.config;let a=!1;const l={components:{"uni-ai-msg":()=>"../../components/uni-ai-msg/uni-ai-msg.js"},data:()=>({scrollIntoView:"",msgList:[],requestState:0,insufficientScore:!1,content:"",sseIndex:0,enableStream:!0,isWidescreen:!1,adpid:o,llmModel:!1,keyboardHeight:0}),computed:{inputBoxDisabled(){return 0!==this.sseIndex||!(!this.msgList.length||this.msgList.length%2==0)},NODE_ENV:()=>"production",footBoxPaddingBottom(){return(this.keyboardHeight||10)+"px"}},watch:{msgList:{handler(s){console.log("msgList:",s),e.index.setStorage({key:"uni-ai-msg",data:s})},deep:!0},insufficientScore(s){e.index.setStorage({key:"uni-ai-chat-insufficientScore",data:s})},llmModel(s){e.index.setStorage({key:"uni-ai-chat-llmModel",data:s})}},beforeMount(){},async mounted(){if(this.adpid&&e.Bs.getCurrentUserInfo().tokenExpired>Date.now()){let s=e.Bs.databaseForJQL(),t=await s.collection("uni-id-users").where({_id:e.Bs.getCurrentUserInfo().uid}).field("score").get();console.log("当前用户有多少积分:",t.data[0]&&t.data[0].score)}this.msgList=e.index.getStorageSync("uni-ai-msg")||[],this.llmModel=e.index.getStorageSync("uni-ai-chat-llmModel"),this.insufficientScore=e.index.getStorageSync("uni-ai-chat-insufficientScore")||!1;let s=this.msgList.length;if(s){this.msgList[s-1].isAi||this.send()}this.$nextTick((()=>{this.showLastMsg()})),e.index.onKeyboardHeightChange((e=>{this.keyboardHeight=e.height,this.$nextTick((()=>{this.showLastMsg()}))}))},methods:{setLLMmodel(){this.$refs["llm-config"].open((e=>{console.log("model",e),this.llmModel=e}))},async checkIsOpenPush(){try{await e.index.getPushClientId(),this.checkIsOpenPush=()=>{}}catch(s){this.enableStream=!1}},updateLastMsg(e){let s=this.msgList.length;if(0===s)return;let t=this.msgList[s-1];if("function"==typeof e){e(t)}else{const[e,s=!1]=arguments;t=s?e:Object.assign(t,e)}this.msgList.splice(s-1,1,t)},onAdClose(s){if(console.log("onAdClose e.detail.isEnded",s.detail.isEnded),s.detail.isEnded){let s=0;e.index.showLoading({mask:!0});let t=setInterval((async i=>{s++;const n=e.Bs.database();let o=await n.collection("uni-id-users").where('"_id" == $cloudEnv_uid').field("score").get(),{score:a}=o.result.data[0]||{};console.log("score",a),(a>0||s>5)&&(clearInterval(t),e.index.hideLoading(),a>0&&(this.insufficientScore=!1,this.msgList.pop(),this.$nextTick((()=>{this.send(),e.index.showToast({title:"积分余额:"+a,icon:"none"})}))))}),2e3)}},async changeAnswer(){this.sseIndex&&this.closeSseChannel(),this.msgList.pop(),this.updateLastMsg({illegal:!1}),this.insufficientScore=!1,this.send()},removeMsg(e){this.msgList[e].isAi&&(e-=1),this.sseIndex&&e==this.msgList.length-2&&this.closeSseChannel(),this.msgList.splice(e,2)},async beforeSend(){if(this.inputBoxDisabled)return e.index.showToast({title:"ai正在回复中不能发送",icon:"none"});if(this.adpid){if(!e.index.getStorageSync("uni_id_token"))return e.index.showModal({content:"启用激励视频，客户端需登录并启用安全网络",showCancel:!1,confirmText:"查看详情",complete(){e.index.setClipboardData({data:"https://uniapp.dcloud.net.cn/uniCloud/uni-ai-chat.html#ad",showToast:!1,success(){e.index.showToast({title:"已复制文档链接，请到浏览器粘贴浏览",icon:"none",duration:5e3})}})}})}if(!this.content)return e.index.showToast({title:"内容不能为空",icon:"none"});this.msgList.push({isAi:!1,content:this.content,create_time:Date.now()}),this.showLastMsg(),this.$nextTick((()=>{this.content=""})),this.send()},async send(){this.requestState=0,n.clear(),this.afterChatCompletion&&this.afterChatCompletion.clear&&this.afterChatCompletion.clear();let s,o,l=[],c=JSON.parse(JSON.stringify(this.msgList)),h=[...c].reverse().findIndex((e=>e.summarize));if(-1!=h){let e=c.length-h-1;c[e].content=c[e].summarize,c=c.splice(e)}else c=c.splice(-10);c=c.filter((e=>!e.illegal)),l=c.map((e=>{let s="user";return e.isAi&&(s=e.summarize?"system":"assistant"),{content:e.content,role:s}})),console.log("send to ai messages:",l),await this.checkIsOpenPush(),this.enableStream&&(a=new e.Bs.SSEChannel,this.sliceMsgToLastMsg=new i.SliceMsgToLastMsg(this),a.on("message",(e=>{0===this.sseIndex?this.msgList.push({isAi:!0,content:e,create_time:Date.now()}):this.sliceMsgToLastMsg.addMsg(e),this.showLastMsg(),this.sseIndex++})),a.on("end",(e=>{if(console.log("sse 结束",e),this.sliceMsgToLastMsg.t=0,e&&"object"==typeof e&&e.errCode){let s=e=>{0===this.sseIndex?this.msgList.push({isAi:!0,content:e,create_time:Date.now()}):this.updateLastMsg((s=>{s.content+=e})),this.showLastMsg()};if(60004==e.errCode){let e=this.msgList.length;e%2&&(this.msgList.push({isAi:!0,content:"内容涉及敏感",illegal:!0,create_time:Date.now()}),e+=1),this.msgList[e-2].illegal=!0,this.msgList[e-1].illegal=!0,this.msgList[e-1].content="内容涉及敏感"}else s(e.errMsg)}s()})),await a.open(),function e(t){e.clear=()=>{e.clear.sse&&e.clear.sse(),e.clear.request&&e.clear.request()},Promise.all([new Promise(((t,i)=>{s=t,e.clear.sse=i})),new Promise(((s,t)=>{o=s,e.clear.request=t}))]).then((e=>{a.close(),t.sseIndex=0})).catch((e=>{})),t.afterChatCompletion=e}(this));let r=t.main({coName:"uni-ai-chat",funName:"send",param:[{messages:l,sseChannel:a,llmModel:this.llmModel}],config:{customUI:!0},success:e=>{if(this.requestState=100,!e.data)return;let{reply:s,summarize:t,insufficientScore:i,illegal:n}=e.data;if(0!=this.enableStream||s||(n=!0,s="内容涉及敏感"),0==this.enableStream&&n&&(console.error("内容涉及敏感"),this.updateLastMsg({illegal:!0})),(0==this.enableStream||0==this.sseIndex&&(n||i))&&this.msgList.push({create_time:Date.now(),isAi:!0,content:s,illegal:n}),i&&(this.insufficientScore=!0),t){console.log(" 拿到总结",t);let e=this.msgList.length-1;e-=e%2?2:1,e<1&&(e=1);let s=this.msgList[e];s.summarize=t,this.msgList.splice(e,1,s)}},complete:e=>{this.enableStream&&o(),this.$nextTick((()=>{this.showLastMsg()}))},fail:t=>{console.error(t),this.requestState=-100,e.index.showModal({content:JSON.stringify(t.message),showCancel:!1}),this.enableStream&&s()}});n.push(r)},closeSseChannel(){a&&(a.close(),a=!1,this.sliceMsgToLastMsg.end()),n.clear(),this.sseIndex=0},showLastMsg(){this.$nextTick((()=>{this.scrollIntoView="last-msg-item",this.$nextTick((()=>{this.scrollIntoView=""}))}))},clearAllMsg(s){e.index.showModal({title:"确认要清空聊天记录？",content:"本操作不可撤销",complete:e=>{e.confirm&&(this.closeSseChannel(),this.msgList.splice(0,this.msgList.length))}})}}};if(!Array){(e.resolveComponent("uni-ai-msg")+e.resolveComponent("uni-icons")+e.resolveComponent("llm-config"))()}Math;const c=e._export_sfc(l,[["render",function(s,t,i,n,o,a){return e.e({a:0===o.msgList.length},(o.msgList.length,{}),{b:e.f(o.msgList,((s,t,i)=>({a:e.sr("msg","c91a967c-0-"+i,{f:1}),b:t,c:e.o(a.changeAnswer,t),d:e.o((e=>a.removeMsg(t)),t),e:"c91a967c-0-"+i,f:e.p({msg:s,"show-cursor":t==o.msgList.length-1&&o.msgList.length%2==0&&o.sseIndex,isLastMsg:t==o.msgList.length-1})}))),c:o.msgList.length%2!=0},o.msgList.length%2!=0?e.e({d:-100==o.requestState},-100==o.requestState?{e:e.o(a.send),f:e.p({color:"#d22",type:"refresh-filled"})}:(o.msgList.length,{}),{g:o.msgList.length}):{},{h:o.adpid},(o.adpid,{}),{i:o.sseIndex},o.sseIndex?{j:e.o(((...e)=>a.closeSseChannel&&a.closeSseChannel(...e)))}:{},{k:o.scrollIntoView,l:!o.isWidescreen},o.isWidescreen?{}:{m:e.o(a.clearAllMsg),n:e.p({type:"trash",size:"24",color:"#888"})},{o:!o.isWidescreen,p:-1,q:o.content,r:e.o((e=>o.content=e.detail.value)),s:e.o(((...e)=>a.beforeSend&&a.beforeSend(...e))),t:a.inputBoxDisabled||!o.content,v:o.msgList.length&&o.msgList.length%2!=0?"ai正在回复中不能发送":"",w:a.footBoxPaddingBottom,x:e.sr("llm-config","c91a967c-3")})}]]);wx.createPage(c);
