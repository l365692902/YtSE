
// 对infoVideo数组中,视频更新顺序进行排序. 从新到旧
function videoMergeSort(array) {  //采用自上而下的递归方法
	var length = array.length;
	if (length < 2) {
		return array;
	}
	var m = (length >> 1),
		left = array.slice(0, m),
		right = array.slice(m); //拆分为两个子数组
	return merge(videoMergeSort(left), videoMergeSort(right));//子数组继续递归拆分,然后再合并
}
function merge(left, right) { //合并两个子数组
	var result = [];
	while (left.length && right.length) {
		var item = left[0].upTime >= right[0].upTime ? left.shift() : right.shift();//注意:判断的条件是小于或等于,如果只是小于,那么排序将不稳定.
		result.push(item);
	}
	return result.concat(left.length ? left : right);
}

//for debug
function popUpNotification(message) {
	browser.notifications.create({
		"type": "basic",
		"title": "Hey boy",
		"message": message
	});
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

	vInfo = new infoVideo($(il_video).html(), title, videoUrl, coverUrl, videoTime, channelName, channelUrl, uptimeStr, new Date());

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
	//console.log("-----debug--------");
	//console.log(uptimeStr);

	if (uptimeStr.includes(Zhftime1)) {
		// 繁体中文 "上次更新時間：xxxx年xx月xx日"
		var timeStr = uptimeStr.substring(Zhftime1.length);

		vInfo.upTime = convertAbTime2Int(timeStr);

	} else if (uptimeStr.includes(Zhtime1)) {
		// 中文 "最后更新时间：xxxx年xx月xx日"
		var timeStr = uptimeStr.substring(Zhtime1.length);
		//console.log(timeStr);
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

// 查找关键词对应的视频
function updateSearchList(list_KeyWord) {
	// 筛选出符合关键词的视频
	//console.log("start update search list");
	let list_vedio = new Array();
	searchListOnline(list_KeyWord).then((list_SearchResults) => {
		//console.log("final:");
		//console.log(list_SearchResults)
		//console.log(list_SearchResults.length);

		list_vedio.push.apply(list_vedio, filterSearch(list_KeyWord, list_SearchResults));
		//console.log("num video : ", list_vedio.length);
		// debug
		//for (let i = 0; i < list_vedio.length; i++) {
		//	console.log("<-----" + i+"-th video----->");
		//	list_vedio[i].show();
		//}		

		return searchPlayListOnline(list_KeyWord);
	}).then((list_Playlistmainpage) => {
		//console.log("final:");
		console.log("num video : ", list_vedio.length);
		console.log(list_Playlistmainpage.length);

		// 或得playList更新时间
		for (let i = 0; i < list_KeyWord.length; i++) {
			if (list_KeyWord[i].playList != "") {
				for (let j = 0; j < list_vedio.length; j++) {
					if (list_KeyWord[i].channel == list_vedio[j].channelName && list_KeyWord[i].playList == list_vedio[j].title) {
						updatePlayListInfo(list_vedio[j], list_Playlistmainpage[i]);
					}
				}
			}
		}
		//list_vedio.push.apply(list_vedio, filterSearch(list_KeyWord,list_SearchResults));
		//console.log("num video : ", list_vedio.length);
		list_vedio = videoMergeSort(list_vedio);

		//// debug

		for (let i = 0; i < list_vedio.length; i++) {
			console.log("<-----" + i + "-th video----->");
			list_vedio[i].show();
		}

		//let  storageVideo = browser.storage.local.set({ObjListVideo:{list_vedio}});
		let storageVideo = browser.storage.local.set({ list_vedio });
	});
	// //按按钮发消息
	// browser.tabs.query({
	// 	url: "*://*.youtube.com/feed/subscription*"
	// }).then((tabs) => {
	// 	for (let tab of tabs) {
	// 		browser.tabs.sendMessage(
	// 			tab.id,
	// 			{ greeting: "Hey boy, from background" }
	// 		)
	// 	}
	// }).catch((error) => { console.log(`Error:${error}`) })
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
list_KeyWord[2] = new keyWord("《萌仔萌萌宅》", "湖南卫视芒果TV官方频道 China HunanTV Official Channel");
//list_KeyWord[0] = new keyWord("Christmas Songs for Kids | Christmas Songs | Nursery Rhymes and Baby Songs from Dave and Ava");
//list_KeyWord[0] = new keyWord("","","【超清】《爸爸去哪儿》第五季Dad Where Are We Going S05——王牌亲子综艺节目再度回归【马来西亚地区已可以观看全13期+特别版】");
//list_KeyWord[1] = new keyWord("老师;","阅后即瞎 - 官方频道");
//list_KeyWord[2] = new keyWord("爸爸去哪儿5 ENG SUB","湖南卫视芒果TV官方频道 China HunanTV Official Channel");

// 寻找youtuber对应字符
for (let i = 0; i < list_KeyWord.length; i++) {
	// searchChannelNum(list_KeyWord[i]);
	//list_KeyWord[i].show();
	initialUrl(list_KeyWord[i]);
	console.log("=======");

}

//browser.storage.local.clear();
console.log("初始化完成");
//convertReTime2Int("2 小时前");

// 输出关键字信息
//console.log("list_length :" + list_KeyWord.length);
//for (let i = 0; i < list_KeyWord.length; i++) {
//	console.log((i + 1), "-th \n关键词 : " + list_KeyWord[i].self + "\nchannel : " + list_KeyWord[i].channel + "\nchannel Url : " + list_KeyWord[i].channelUrl);
//}
//console.log("----------");

// 点击按钮刷新视频列表
//browser.browserAction.onClicked.addListener(() =>{
//	//console.log("click");
//	updateSearchList(list_KeyWord)
//});

// 自动更新视频列表

//////////////////////////////////////////////////////////////////////////////////////
// function updateSearchListIterator(list_KeyWord,timeGap){
// 	// 如果list_KeyWord更新了,这里list_KeyWord是否也会更新?
// 	var Now = new Date();
// 	console.log("updat time : ", Now);
// 	updateSearchList(list_KeyWord);
// 	setTimeout(() => { updateSearchListIterator(list_KeyWord,timeGap) }, timeGap)
// }
// let timeGap = 5*60*1000; // 5 min
// setTimeout(() => {
// 	console.log("First Search List");
// 	updateSearchListIterator(list_KeyWord,timeGap);
// 	}, 60*1000); //浏览器启动一分钟后再执行
///////////////////////////////////////////////////////////////////////////////////////

// browser.webNavigation.onHistoryStateUpdated.addListener((details) => {
// 	console.log(details);
// 	browser.tabs.query({
// 		url: "*://*.youtube.com/feed/subscription*"
// 	}).then((tabs) => {
// 		for (let tab of tabs) {
// 			browser.tabs.sendMessage(
// 				tab.id,
// 				{ greeting: "Hey boy, from background" }
// 			)
// 		}
// 	}).catch((error) => { console.log(`Error:${error}`) })
// }, { url: [{ urlPrefix: "https://www.youtube.com/feed/subscriptions" }] });


function handleTabUpdate(tabId, changeInfo, tabInfo) {
	if (String(changeInfo.url).includes("https://www.youtube.com/feed/subscriptions")) {
		console.log("Tab: " + tabId + " URL changed to " + changeInfo.url);
		console.log(changeInfo)
		browser.tabs.query({
			url: "*://*.youtube.com/feed/subscription*"
		}).then((tabs) => {
			console.log("refreshing it")
			for (let tab of tabs) {
				browser.tabs.reload(tab.Id)
			}
			browser.tabs.onUpdated.removeListener(handleTabUpdate)

			setTimeout(() => { browser.tabs.onUpdated.addListener(handleTabUpdate) }, 30000)

		}).catch((error) => { console.log(`Error:${error}`) })
	}
}
browser.tabs.onUpdated.addListener(handleTabUpdate);
browser.browserAction.onClicked.addListener(() => {
	browser.runtime.openOptionsPage()
	updateSearchList(list_KeyWord);
})


// browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
// 	if (String(changeInfo.url).includes("https://www.youtube.com/feed/subscriptions")) {
// 		console.log("Tab: " + tabId + " URL changed to " + changeInfo.url);
// 		console.log(changeInfo)
// 		browser.tabs.query({
// 			url: "*://*.youtube.com/feed/subscription*"
// 		}).then((tabs) => {
// 			console.log("manually injecting...")
// 			for (let tab of tabs) {
// 				browser.tabs.executeScript({ file: "lib/jquery-3.2.1.min.js" }).then(() => {
// 					return browser.tabs.executeScript({ file: "lib/core.js" })
// 				}).then(() => {
// 					return browser.tabs.executeScript({ file: "content_scripts/content.js" })
// 				})
// 			}
// 		}).catch((error) => { console.log(`Error:${error}`) })
// 	}
// });

