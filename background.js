//for debug
function popUpNotification(message) {
	browser.notifications.create({
		"type": "basic",
		"title": "Hey boy",
		"message": message
	});
}

//for debug
function checkResponse(xhr) {
	// console.log(xhr.response)
	// console.log(xhr.getResponseHeader("Content-Type"))
	let blobFile = new Blob([xhr.response], { type: "text/html;charset=UTF-8" })
	// var blobFile = new Blob([xmlHttp.response], { type: "text/plain;charset=UTF-8" })
	let blobUrl = URL.createObjectURL(blobFile)
	let creating = browser.tabs.create({
		url: blobUrl
	})
}

//promise based asynchronous xmlHttpRequest
function asynHttpRequest(method, url) {
	return new Promise((resolve, reject) => {
		// console.log("%c" + "requesting...: " + url, "color:#00ff00")//DEBUG
		const xhr = new XMLHttpRequest();
		xhr.open(method, url, true);
		xhr.onload = () => {
			checkResponse(xhr);//DEBUG
			resolve(xhr.response);
		};
		xhr.onerror = () => {
			console.log("error occur while accessing " + url);
			reject("error");
		};
		if (method == "POST") {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
		};//needed in post mode
		//counter-anit-scraping
		xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 5.1; rv:37.0) Gecko/20100101 Firefox/37.0');
		xhr.send();
		// popUpNotification("in asyn... request sent");//DEBUG)
	});
}

// 根据关键字列表索取youtube页面
function searchListOnline(list) {
	let url;
	let url_list;
	let list_p = new Array(list.length);

	//console.log("debug : " + list.length);

	for (let i = 0; i < list.length; i++) {
		//console.log("debug : " + i);
		//list[i].show();
		if (list[i].self != "") {
			//console.log("debug : key word");
			// 对keyword查询
			if (list[i].channel != "") {
				if (list[i].channelUrl != "") {
					url = "https://www.youtube.com/" + list[i].channelUrl + "/search?sp=CAISAhAB&query=" + removeNChar(list[i].self).split(';').join(' ');
					console.log(i + "th " + url);
					list_p[i] = asynHttpRequest("GET", url);
				} else {
					// 需要更新channel信息
					//console.log("need update channel info 1");
				}
			} else {
				url = "https://www.youtube.com/results?sp=CAI%253D&search_query=" + removeNChar(list[i].self).split(';').join(' ');
				console.log(i + "th " + url);
				list_p[i] = asynHttpRequest("GET", url);
			}
		} else if (list[i].playList != "") {
			// 对list进行查询
			//console.log("debug : list");
			url = "https://www.youtube.com/results?sp=EgIQAw%253D%253D&search_query=" + removeNChar(list[i].playList);
			console.log(i + "th " + url);
			list_p[i] = asynHttpRequest("GET", url);


		} else {
			// 只含有channel信息
			//console.log("need update channel info 2");
			url = "https://www.youtube.com/results?sp=EgIQAg%253D%253D&search_query=" + removeNChar(list[i].channel);
			console.log(i + "th " + url);
			list_p[i] = asynHttpRequest("GET", url);
		}
	}
	return Promise.all(list_p);
}

// 根据关键字列表索取youtube页面
function searchPlayListOnline(list) {
	let url
	let url_list
	let list_playList = new Array(list.length);

	for (let i = 0; i < list.length; i++) {

		if (list[i].self != "") {
			// 对keyword查询
			if (list[i].channel != "") {
				if (list[i].channelUrl != "") {
					list_playList[i] = ""
				} else {
					// 需要更新channel信息
				}
			} else {
				list_playList[i] = ""
			}
		} else if (list[i].list != "") {
			// 对list进行查询

			url_list = "https://www.youtube.com" + list[i].playListUrl;
			list_playList[i] = asynHttpRequest("GET", url_list);

		} else {
			// 只含有channel信息,返回空

		}
	}
	return Promise.all(list_playList);
}


//移除youtube不识别的字符
function removeNChar(str) {
	var result = "";
	//console.log(str.length);
	for (var i = 0; i < str.length; i++) {
		//console.log(str[i],str.charCodeAt(i));
		if (str.charCodeAt(i) == 12298) { //《
			result += " "; //String.fromCharCode(str.charCodeAt(i)-12256);
		} else if (str.charCodeAt(i) == 12299) { //》
			result += " "; //String.fromCharCode(str.charCodeAt(i)-12256);
		} else {
			result += String.fromCharCode(str.charCodeAt(i));
		}
	}
	return result;
}


// 获得频道信息
function getChannelInfo(il_video) {
	/*\ 
	|| 
	\*/
	// 不是列表
	channelObj = $(il_video).find("a.yt-uix-tile-link.yt-ui-ellipsis.yt-ui-ellipsis-2.yt-uix-sessionlink.spf-link");
	var channelName = $(channelObj).text();
	var channelUrl = $(channelObj).attr("href");

	//获取时长,和封面
	coverObj = $(il_video).find("a.yt-uix-sessionlink.spf-link").find("div.yt-thumb.video-thumb").find("span.yt-thumb-simple");

	var coverUrl_onload = $(coverObj).find("img").attr("data-thumb");
	if (coverUrl_onload === undefined) {
		var coverUrl = $(coverObj).find("img").attr("src");
	} else {
		var coverUrl = coverUrl_onload;
	}

	//var videoTime = $(coverObj).find("span").text();
	//console.log(videoTime);
	// 获取频道信息
	//channelObj = $(il_video).find("div.yt-lockup-content").find("div.yt-lockup-byline").find("a.yt-uix-sessionlink.spf-link");
	//var channelName = $(channelObj).text();
	//var channelUrl = $(channelObj).attr("href");

	// 获取更新时间
	//timeObj = $(il_video).find("div.yt-lockup-content").find("div.yt-lockup-meta").find("ul.yt-lockup-meta-info");
	//timeObj = $(il_video).find("ul.yt-lockup-meta-info");
	//uptimeli = $(timeObj).find("li").toArray()[0];
	//console.log("----------------");
	//console.log($(uptimeli).text(),convertReTime2Int($(uptimeli).text()));

	var tNow = new Date();
	uptimeStr = tNow.valueOf();

	vInfo = new infoVideo(il_video, "", "", coverUrl, "", channelName, channelUrl, "", tNow);

	//vInfo.show();
	return vInfo;

	// vInfo.show();

}

// 获得播放列表信息
function getPlayListInfo(il_video) {
	/*\ 
	|| 
	\*/

	titleObj = $(il_video).find("a.yt-uix-tile-link.yt-ui-ellipsis.yt-ui-ellipsis-2.yt-uix-sessionlink.spf-link");
	var title = $(titleObj).text();

	//获取时长,和封面
	coverObj = $(il_video).find("a.yt-uix-sessionlink.spf-link").find("div.yt-thumb.video-thumb").find("span.yt-thumb-simple");

	var coverUrl_onload = $(coverObj).find("img").attr("data-thumb");
	if (coverUrl_onload === undefined) {
		var coverUrl = $(coverObj).find("img").attr("src");
	} else {
		var coverUrl = coverUrl_onload;
	}

	var videoTime = $(coverObj).find("span").text();

	// 获取频道信息
	channelObj = $(il_video).find("div.yt-lockup-content").find("div.yt-lockup-byline").find("a.yt-uix-sessionlink.spf-link");
	var channelName = $(channelObj).text();
	var channelUrl = $(channelObj).attr("href");

	// 获取更新时间
	listUrlObj = $(il_video).find("div.yt-lockup-content").find("div.yt-lockup-meta").find("ul.yt-lockup-meta-info");
	//timeObj = $(il_video).find("ul.yt-lockup-meta-info");
	//uptimeli = $(timeObj).find("li").toArray()[0];
	//uptimeStr = $(uptimeli).text();
	uptimeStr = '' // 更新时间无法在搜索页面拿到,要在主页拿到; 在updatePlayListInfo函数中
	var videoUrl = $(listUrlObj).find("li").children().attr("href");

	vInfo = new infoVideo(il_video, title, videoUrl, coverUrl, videoTime, channelName, channelUrl, uptimeStr, new Date());

	return vInfo;
	// vInfo.show();

}

// PlayList更新时间无法在搜索界面找到,只能在主页看到
function updatePlayListInfo(vInfo, ListPage) {

	var Zhtime1 = "最后更新时间：";
	var Zhtime2 = "更新";

	var Zhftime1 = "上次更新時間：";
	var Zhftime2 = "更新";

	var Entime1 = "Last updated on ";
	var Entime1 = "Updated";
	// 获取更新时间
	uptimeObj = $(ListPage).find("div.pl-header-content").find("ul.pl-header-details").find("li").toArray()[3];
	var uptimeStr = $(uptimeObj).text();
	// console.log(uptimeStr);

	if (uptimeStr.includes(Zhtime1)) {
		// 繁体中文 "上次更新時間：xxxx年xx月xx日"
		var timeStr = uptimeStr.substring(Zhftime1.length);

		vInfo.upTime = convertAbTime2Int(timeStr);

	} else if (uptimeStr.includes(Zhtime1)) {
		// 中文 "最后更新时间：xxxx年xx月xx日"
		var timeStr = uptimeStr.substring(Zhtime1.length);

		vInfo.upTime = convertAbTime2Int(timeStr);

	} else if (uptimeStr.includes(Zhtime2)) {
		// 中文 "几天前更新"
		var timeStr = uptimeStr.substring(0, uptimeStr.length - Zhtime2.length);
		var tNow = new Date();
		vInfo.upTime = convertReTime2Int(timeStr) + tNow.valueOf();;

	} else if (uptimeStr.includes(Entime2)) {
		// 英文 Last updated on Jul xx,xxxx
		var timeStr = uptimeStr.substring(Entime2.length);

		vInfo.upTime = convertReTime2Int(timeStr);
	} else if (uptimeStr.includes(Entime1)) {
		// 英文 Updated xx days ago
		var timeStr = uptimeStr.substring(Entime1.length);
		var tNow = new Date();
		vInfo.upTime = convertAbTime2Int(timeStr) + tNow.valueOf();
	} else {
		// 其他语言,没法分析
	}

}



// 针对channel的查找页过滤
function filterChannelSearch(list_Keyword, list_SearchResults) {
	/*\ 
	|| 根据关键字过滤搜索页
	\*/
	let list_vInfo = new Array();
	if (list_SearchResults.length != list_Keyword.length) {
		console.log("-----length neq-----");
		//长度不等
		return;
	}
	for (let i = 0; i < list_SearchResults.length; i++) {
		//console.log( "K : " +  i + '------------');
		//list_Keyword[i].show();
		// string to Document
		// doc = $.parseHTML(list_SearchResults[i]);
		doc = $($(list_SearchResults[i]))
		if (list_Keyword[i].channel == '') {

		} else {
			// 在频道搜索
			//console.log("filterChannelSearch -> in channel");
			doc.find('ol.item-section').children().each(function (index) {
				//console.log( "P : " + index + '------------');
				//console.log(this);

				vInfo = getChannelInfo(this);
				//vInfo.show();
				if (vInfo.channelName == list_Keyword[i].channel) {
					//vInfo.show();
					list_vInfo.push(vInfo);
				} else {
					//console.log("not satisfied keyword.");
					//vInfo.show();
				}
				//console.log("------------>");

			});

		}


	}

	return list_vInfo;
}



// 在添加关键字后查找channel或list对应的Url
function initialUrl(key_word) {
	// class赋值 直接 key_word_local=key_word 是指针, 两个变量指向一个地址
	let key_word_local = new keyWord(key_word.self, key_word.channel, key_word.playList);

	console.log("----查找URL------");
	//key_word_local.show();
	//console.log(key_world.playList)
	let vedio = new Array();
	key_word_local.self = "";


	if (key_word.playList != "" || key_word.channel != "") {
		searchListOnline([key_word_local]).then((list_SearchResults) => {

			//console.log("initial final : ",list_SearchResults.length);
			//console.log(list_SearchResults)
			//key_word_local.show();
			if (key_word.playList != "" && key_word.playListUrl == "") {
				//key_word.show();
				console.log("查找play list");
				////key_word.show();
				vedio.push.apply(vedio, filterSearch([key_word_local], list_SearchResults));
			} else if (key_word.channel != "" && key_word.channelUrl == "") {
				//key_word.show();
				console.log("查找channel");
				////key_word.show();
				vedio.push.apply(vedio, filterChannelSearch([key_word_local], list_SearchResults));
			}

			//console.log("initial num video : ", vedio.length);
			// debug

			if (vedio.length > 0) {
				// 我们只用查找出来第一个的
				//vedio[0].show();
				if (key_word.playList != "" && key_word.playListUrl == "") {
					//需要查找playlist的URL

					//key_word_local.show();
					key_word.channel = vedio[0].channelName;
					key_word.channelUrl = vedio[0].channelUrl;
					key_word.playListUrl = vedio[0].videoUrl;
					console.log("找到play list");
					//key_word.show();		
				} else if (key_word.channel != "" && key_word.channelUrl == "") {

					key_word.channel = vedio[0].channelName;
					key_word.channelUrl = vedio[0].channelUrl;
					console.log("找到Channel");
					//key_word.show();
				}

			} else {
				//没有查找到list
				console.log("没有找到Url");
			}
			console.log("-------------->");
		});
	}

}




//======================================================START FROM HERE===============================
// 关键词储存在对象里
// 对象KeyWord
// word 储存关键字, 空为不指定
// channel 储存所属频道, 空为不指定
// list 储存关键字所属列表, 空为不指定
// word channel list 三个变量不能同时为零



// 储存关键词
let list_KeyWord = new Array();
// 关键词对应的搜索页面
//let list_SearchResults = new Array();
//let list_Playlistmainpage = new Array();



if (jQuery) {
	console.log("jQuery loaded");

}

console.log("开始初始化");
// 目前只储存两个


list_KeyWord[0] = new keyWord("爸爸去哪儿5;完整版;ENG SUB", "湖南卫视芒果TV官方频道 China HunanTV Official Channel");
list_KeyWord[1] = new keyWord("", "", "Season One - THE Acapella Producer");
//list_KeyWord[0] = new keyWord("Christmas Songs for Kids | Christmas Songs | Nursery Rhymes and Baby Songs from Dave and Ava");
//list_KeyWord[0] = new keyWord("","","【超清】《爸爸去哪儿》第五季Dad Where Are We Going S05——王牌亲子综艺节目再度回归【马来西亚地区已可以观看全13期+特别版】");
//list_KeyWord[1] = new keyWord("老师;","阅后即瞎 - 官方频道");
//list_KeyWord[2] = new keyWord("爸爸去哪儿5 ENG SUB","湖南卫视芒果TV官方频道 China HunanTV Official Channel");

// 寻找youtuber对应字符
for (let i = 0; i < list_KeyWord.length; i++) {
	// searchChannelNum(list_KeyWord[i]);
	//list_KeyWord[i].show();
	// initialUrl(list_KeyWord[i]);
	console.log("=======");

}


console.log("初始化完成");
//convertReTime2Int("2 小时前");

// 输出关键字信息
//console.log("list_length :" + list_KeyWord.length);
//for (let i = 0; i < list_KeyWord.length; i++) {
//	console.log((i + 1), "-th \n关键词 : " + list_KeyWord[i].self + "\nchannel : " + list_KeyWord[i].channel + "\nchannel Url : " + list_KeyWord[i].channelUrl);
//}
//console.log("----------");


browser.browserAction.onClicked.addListener(() => {
	browser.runtime.openOptionsPage()
})




