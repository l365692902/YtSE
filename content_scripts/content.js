//================================FUNCTIONS====================================


// =============================START FROM HERE================================
//let test=new keyWord("this is a test")
//test.show()
//window.alert("Hey boy")

function convertSearchToFeed(ObjM, VedioInfo){
	// 替换观看历史
	// 替换标题
	// 替换up主
	ObjM_local = ObjM.clone();
	
	// 首先替换封面
	$(ObjM_local).find("span.yt-thumb-simple").find("img").attr('src', VedioInfo.coverUrl);
	// 替换封面链接
	$(ObjM_local).find("div.yt-lockup-thumbnail.contains-percent-duration-watched.contains-addto").find("a.yt-uix-sessionlink.spf-link").remove();
	$(ObjM_local).find("div.yt-lockup-thumbnail.contains-percent-duration-watched.contains-addto").prepend(
		function(){
			return $(VedioInfo.il).find("div.yt-lockup-thumbnail").find("a.yt-uix-sessionlink").attr("classs", " yt-uix-sessionlink      spf-link ");
		}
	)
	
	// 替换时长
	$(ObjM_local).find("span.video-time").text( VedioInfo.videoTime);
	
	// 替换标题
	//删除原标题
	$(ObjM_local).find("h3.yt-lockup-title.contains-action-menu").children().remove();
	// 添加新标题,时长
	$(ObjM_local).find("h3.yt-lockup-title.contains-action-menu").prepend($(VedioInfo.il).find("h3.yt-lockup-title").children());
	
	// 替换up
	$(ObjM_local).find("div.yt-lockup-byline.yt-ui-ellipsis.yt-ui-ellipsis-2").children().remove();
	$(ObjM_local).find("div.yt-lockup-byline.yt-ui-ellipsis.yt-ui-ellipsis-2").prepend($(VedioInfo.il).find("div.yt-lockup-byline").children());
	
	// 替换观看次数 更新时间
	$(ObjM_local).find("ul.yt-lockup-meta-info").children().remove();
	$(VedioInfo.il).find("ul.yt-lockup-meta-info").children().each(function (index){
		$(ObjM_local).find("ul.yt-lockup-meta-info").prepend($(this));
	});
	

	// 检查视频是否观看过
	$(ObjM_local).find("span.resume-playback-background").remove();
	$(ObjM_local).find("span.resume-playback-progress-bar").remove();
	Objresume = $(VedioInfo.il).find("span.resume-playback-progress-bar");
	if($(Objresume).length > 0){
		$(ObjM_local).find("div.yt-lockup-thumbnail.contains-percent-duration-watched.contains-addto").append($(VedioInfo.il).find("span.resume-playback-background"));
		$(ObjM_local).find("div.yt-lockup-thumbnail.contains-percent-duration-watched.contains-addto").append($(Objresume));
		
	}
	
	return ObjM_local;
}



// 读取已获得的列表
console.log("load video list");
//let  getListVedio = browser.storage.local.get("list_vedio");
//getListVedio.then(onGot);
let gettingItem = browser.storage.local.get("list_vedio");
gettingItem.then((Obj) =>{
	if(isObjEmpty(Obj)){
		//console.log("list is empty");
		
		return [];
	}else{
		//console.log("list is not empty");
		//console.log(Obj);
		//console.log(Obj.list_vedio.length);
		return (Obj.list_vedio);
	}
}).then((list_vedio) => {

	console.log("load " + list_vedio.length + " videos");
	
	// 开始解析网页
	$(document).ready(function(){
		console.log("ready to load");
	//Obj = $("div.multirow-shelf").find("ul.shelf-content");
	//尝试插入
	//console.log("<ytd-grid-video-renderer class=\"style-scope ytd-grid-renderer\">"+
	//  list_vedio[0].il +
	//  "</ytd-grid-video-renderer>");
	//$("<ytd-grid-video-renderer class=\"style-scope ytd-grid-renderer\">"+
	//  list_vedio[0].il +
	//  "</ytd-grid-video-renderer>").insertAfter($("div.style-scope.ytd-grid-renderer"));
	//debug_1 = new infoVideo();
	//debug_1 = getVideoInfo(list_vedio[0].il);
	//debug_1.show();
	
	//新版
	//$("<ytd-grid-video-renderer class=\"style-scope ytd-grid-renderer\">"+
	//  list_vedio[0].il +
	//  "</ytd-grid-video-renderer>").insertAfter(
	//								  $("ytd-grid-renderer.style-scope.ytd-shelf-renderer")
	//								  .find("div.style-scope.ytd-grid-renderer")
	//								  .find("ytd-grid-video-renderer.style-scope.ytd-grid-renderer"));
	
	//旧版
	// 首先复制一个视频作为模板
	Obj = $("div.multirow-shelf").find("ul.shelf-content").find("li.yt-shelf-grid-item");
	
	//console.log("<li class=\"yt-shelf-grid-item\">"+list_vedio[0].il +"</li>");
	$(Obj).each(function(index){
		if(index == 0){
			ObjInsertModel=$(this).clone();
			//console.log(ObjInsertModel);
		}
		
	});
	
	
	
	$(Obj).each(function(index){
		if(index == 1){
			$(convertSearchToFeed(ObjInsertModel,list_vedio[0])).insertAfter($(this));
		}
		
	});
	
		
	
	});
});