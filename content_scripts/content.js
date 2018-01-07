//================================FUNCTIONS====================================
function convertSearchToFeed(ObjM, VedioInfo) {
	// 替换观看历史
	// 替换标题
	// 替换up主
	ObjM_local = ObjM.clone();

	// 首先替换封面
	$(ObjM_local).find("span.yt-thumb-simple").find("img").attr('src', VedioInfo.coverUrl);
	//console.log($(ObjList).find("img").attr("width"));
	// 替换封面链接
	
	//$(ObjM_local).find("div.yt-lockup-thumbnail.contains-percent-duration-watched.contains-addto").find("a.yt-uix-sessionlink.spf-link").remove();
	//console.log("change cover");
	//$(ObjM_local).find("div.yt-lockup-thumbnail.contains-percent-duration-watched.contains-addto").prepend(
	//	function () {
	//		console.log("change cover2 ");
	//		if($(VedioInfo.il).find("div.yt-lockup-thumbnail").find("a.yt-uix-sessionlink").length > 0){
	//			console.log("existed");
	//			return $(VedioInfo.il).find("div.yt-lockup-thumbnail").find("a.yt-uix-sessionlink").attr("classs", " yt-uix-sessionlink      spf-link ");
	//		}else{
	//			console.log("no existed");
	//			return $(VedioInfo.il).find("div.yt-lockup-thumbnail.yt-pl-thumb").find("a.yt-pl-thumb-link.yt-uix-sessionlink.spf-link")
	//			.attr("classs", " yt-uix-sessionlink      spf-link ");
	//		}
	//	}
	//)
	//$(ObjM_local).find("div.yt-lockup-thumbnail.contains-addto").find("a.yt-uix-sessionlink.spf-link")
	//.attr("href",  $(VedioInfo.il).find("div.yt-lockup-thumbnail.yt-pl-thumb")
	//.find("a.yt-pl-thumb-link.yt-uix-sessionlink.spf-link").attr("href"));
	$(ObjM_local).find("div.yt-lockup-thumbnail.contains-addto").find("a.yt-uix-sessionlink.spf-link")
	.attr("href",  $(VedioInfo.il).find("h3.yt-lockup-title").find("a").attr("href"));	
	//console.log($(VedioInfo.il).find("h3.yt-lockup-title").find("a").attr("href")
	//);
	//console.log("change cover");
	//$(ObjM_local).find("div.yt-lockup-thumbnail.contains-addto").prepend(
	//	function () {
	//		console.log("change cover2 ");
	//		//if(VedioInfo){
	//			//console.log("list existed");
	//			ObjList = $(VedioInfo.il).find("div.yt-lockup-thumbnail.yt-pl-thumb")
	//			.find("a.yt-pl-thumb-link.yt-uix-sessionlink.spf-link").attr("class", " yt-uix-sessionlink      spf-link ").clone();
	//			//删除列表
	//			$(ObjList).find("div.sidebar").remove();
	//			// 更改图片尺寸
	//			//$(ObjList).find("img").attr("width", "196");
	//			//$(ObjList).find("img").attr("height", "110");
	//			return $(ObjList);
	//		//}else{
	//			//console.log("no existed");
	//			//return $(VedioInfo.il).find("div.yt-lockup-thumbnail.yt-pl-thumb").find("a.yt-pl-thumb-link.yt-uix-sessionlink.spf-link")
	//			//.attr("classs", " yt-uix-sessionlink      spf-link ");
	//		//}
	//	}
	//)
	
	
	// 替换时长
	$(ObjM_local).find("span.video-time").text(VedioInfo.videoTime);

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
	$(VedioInfo.il).find("ul.yt-lockup-meta-info").children().each(function (index) {
		$(ObjM_local).find("ul.yt-lockup-meta-info").prepend($(this));
	});


	// 检查视频是否观看过
	$(ObjM_local).find("span.resume-playback-background").remove();
	$(ObjM_local).find("span.resume-playback-progress-bar").remove();
	Objresume = $(VedioInfo.il).find("span.resume-playback-progress-bar");
	if ($(Objresume).length > 0) {
		$(ObjM_local).find("div.yt-lockup-thumbnail.contains-percent-duration-watched.contains-addto").append($(VedioInfo.il).find("span.resume-playback-background"));
		$(ObjM_local).find("div.yt-lockup-thumbnail.contains-percent-duration-watched.contains-addto").append($(Objresume));

	}

	return ObjM_local;
}

function getFeedVideoInfo(il_video) {
    /*\ 
    || 
    \*/
    if ($(il_video).find("ul.yt-lockup-meta.yt-lockup-playlist-items").length > 0) {
        // 在对channel页面进行搜索的时候无法屏蔽列表,所以这里过滤一下是否为列表
        //该条目是列表
        vInfo = new infoVideo(il_video);
        return vInfo;
    } else {
        // 不是列表
//        titleObj = $(il_video).find("a.yt-uix-tile-link.yt-ui-ellipsis.yt-ui-ellipsis-2.yt-uix-sessionlink.spf-link");
//        var title = $(titleObj).text();
//        var videoUrl = $(titleObj).attr("href");
//
//        //获取时长,和封面
//        //coverObj = $(il_video).find("a.yt-uix-sessionlink.spf-link").find("div.yt-thumb.video-thumb").find("span.yt-thumb-simple");
//		//if(coverObj === undefined){
//		//	var coverUrl_onload = $(coverObj).find("img").attr("data-thumb");
//		//}else{
//		//	var coverUrl_onload = $(coverObj).find("img").attr("data-thumb");
//		//	if (coverUrl_onload === undefined) {
//		//		var coverUrl = $(coverObj).find("img").attr("src");
//		//	} else {
//		//		var coverUrl = coverUrl_onload;
//		//	}			
//		//}
//		var coverUrl_onload = $(il_video).find("img").attr("data-thumb");
//		if (coverUrl_onload === undefined) {
//			var coverUrl = $(il_video).find("img").attr("src");
//		}else{
//			var coverUrl = coverUrl_onload;
//		}
		
        //var videoTime = $(il_video).find("span.video-time").text();
        ////console.log(videoTime);
        //// 获取频道信息
        //channelObj = $(il_video).find("div.yt-lockup-content").find("div.yt-lockup-byline").find("a.yt-uix-sessionlink.spf-link");
        //var channelName = $(channelObj).text();
        //var channelUrl = $(channelObj).attr("href");

        // 获取更新时间
        timeObj = $(il_video).find("div.yt-lockup-content").find("div.yt-lockup-meta").find("ul.yt-lockup-meta-info");
        var tNow = new Date();
        if ($(timeObj).find("li").toArray().length == 2) {
            uptimeli = $(timeObj).find("li").toArray()[1];
            uptimeStr = convertReTime2Int($(uptimeli).text()) + tNow.valueOf();
        } else {
            // 可能在直播
            if ($(il_video).find("div.yt-lockup-content").find("div.yt-lockup-badges").find("ul.yt-badge-list").find("span.yt-badge.yt-badge-live").length > 0) {
                // 在直播
                uptimeStr = tNow.valueOf();
            } else {
                // 不知道类别
                uptimeStr = tNow.valueOf();
            }
        }



        //vInfo = new infoVideo($(il_video).html(), title, videoUrl, coverUrl, videoTime, channelName, channelUrl, uptimeStr, tNow);
		vInfo = new infoVideo("", "", "", "", "", "", "", uptimeStr, tNow);

        //vInfo.show();
        return vInfo;

    }

    // vInfo.show();

}

// =============================START FROM HERE================================
//let test=new keyWord("this is a test")
//test.show()
//window.alert("Hey boy")




// 读取已获得的列表
console.log("load video list");
//let  getListVedio = browser.storage.local.get("list_vedio");
//getListVedio.then(onGot);
function Insert(){
		// 检查页面是否已经被加载
	if($("#insertYtse").length){
		console.log("have inserted");
	}else{
		console.log("insert now");
		let gettingItem = browser.storage.local.get("list_vedio");
		gettingItem.then((Obj) => {
			if (isObjEmpty(Obj)) {
				//console.log("list is empty");
		
				return [];
			} else {
				//console.log("list is not empty");
				//console.log(Obj);
				//console.log(Obj.list_vedio.length);
				return (Obj.list_vedio);
			}
		}).then((list_vedio) => {
		
			console.log("load " + list_vedio.length + " videos");
		
			// 开始解析网页
			$(document).ready(function () {
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
				$(Obj).each(function (index) {
					if (index == 0) {
						ObjInsertModel = $(this).clone();
						//console.log(ObjInsertModel);
					}
		
				});
				
				
				// 准备插入
				let indexBegin = 0;
				for (let i = 0; i < list_vedio.length; i++) {
					let haveLoaded = false;
					$(Obj).each(function (index) {
						if (index >= indexBegin && !haveLoaded) {
							
							//$(convertSearchToFeed(ObjInsertModel, list_vedio[13])).insertAfter($(this));
							// 输出订阅列表时间
							//let vInfo = new infoVideo();
							vInfo = getFeedVideoInfo(this); // 没有title和videoUrl
							if(vInfo.upTime < list_vedio[i].upTime){
								ObjIn = $(convertSearchToFeed(ObjInsertModel, list_vedio[i]));
								$(ObjIn).css("border", "1px dashed #4CAF50"); //outline: #4CAF50 solid 10px;
								//$(ObjIn).css("outline", "#4CAF50 solid 5px"); 
								$(ObjIn).insertBefore($(this));
								
								// 添加框线
								//$(this).next().css("border", "1px solid red");
								indexBegin = indexBegin + 1;
								haveLoaded = true;
							}
							//vInfo.show();
						}
		
					});
				}
				
				// 插入结束后,在页面做标记
				markLoaded = "<div id=\"insertYtse\"></div>"
				$("#content").append( $(markLoaded ) );
				//console.log(list_vedio[13].il);
				
				//// 尝试给提第一个视频添加边框
				//$(Obj).each(function (index) {
				//	if (index == 0) {
				//		$(this).css("border", "1px solid red");
				//		console.log(ObjInsertModel);
				//	}
				//
				//});		
		
		
			});
		});
	}
}

browser.runtime.onMessage.addListener(request => {
  //console.log("Message from the background script:");
  //console.log(request.greeting);
  Insert();
  return Promise.resolve({response: "Hi from content script"});
});

// //接收到消息插入信息

// // $(document).ready(function () {
// $(window).ready(function () {
// 	browser.runtime.onMessage.addListener((request) => {
// 		console.log(request.greeting)
// 		console.log("load video list");
// 		let gettingItem = browser.storage.local.get("list_vedio");
// 		gettingItem.then((Obj) => {
// 			if (isObjEmpty(Obj)) {
// 				return [];
// 			} else {
// 				return (Obj.list_vedio);
// 			}
// 		}).then((list_vedio) => {
// 			console.log("load " + list_vedio.length + " videos");
// 			//$(document).ready(function () {
// 			console.log("ready to load");
// 			Obj = $("div.multirow-shelf").find("ul.shelf-content").find("li.yt-shelf-grid-item");
// 			$(Obj).each(function (index) {
// 				if (index == 0) {
// 					ObjInsertModel = $(this).clone();
// 				}
// 			});
// 			$(Obj).each(function (index) {
// 				if (index == 1) {
// 					$(convertSearchToFeed(ObjInsertModel, list_vedio[0])).insertAfter($(this));
// 				}
// 			});
// 			//});
// 		});
// 		return Promise.resolve({ response: "Hi, from content script" })
// 	})
// });

