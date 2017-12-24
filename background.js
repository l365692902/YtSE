//for debug
function popUpNotification(message) {
	browser.notifications.create({
		"type": "basic",
		"title": "Hey boy",
		"message": message
	});
}

class keyWord {
	constructor(keyWord = "", channel = "", playList = "") {
		/*\ 
		|| youtube含有两种youtuber 1. channel 2. user
		|| 这两种youtuber在主页url的区别是 
		|| - 1. youtube.com/channel/....
		|| - 2. youtube.com/user/....
		|| 在这里我们不明确的区分这两种youtuber,统一用'channle'来储存名字
		|| channelUrl里储存user/,channel/ 关键字
		\*/
		this.self = keyWord
		this.channel = channel
		this.channelUrl = ''
		this.playList = playList
		
	}
	
}

class infoVideo {
	constructor(il="", title = "", videoUrl="", coverUrl="", videoTime="", channelName="", channelUrl="", upTime = "", time = "" ) {
		/*\ 
		|| 用来储存视频信息
		\*/
	//il储存原始html信息
	this.il = il;	

	this.title = title;
	this.videoUrl = videoUrl;
	
	//获取时长,和封面
	this.coverUrl = coverUrl;
	this.videoTime = videoTime;
	
	// 获取频道信息
	this.channelName = channelName;
	this.channelUrl = channelUrl;

	this.upTime = upTime;
	
	this.time = time;  // 查询词条的当前时间
		
	};
	
	
	show(){
	
		console.log("title : ", this.title);
		console.log("video Url : ", this.videoUrl);
		console.log("cover : ", this.coverUrl);
		console.log("last time : ", this.videoTime);
		console.log("channel : ", this.channelName);
		console.log("channel url : ", this.channelUrl);
		console.log("uptime : ", this.upTime);	
		console.log("time : ", this.time);
		return	

	};
	

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
		const xhr = new XMLHttpRequest()
		xhr.open(method, url, true)
		xhr.onload = () => {
			checkResponse(xhr)//DEBUG
			resolve(xhr.response)
		}
		xhr.onerror = () => {
			console.log("error occur while accessing " + url)
			reject("error")
		}
		if (method == "POST") {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
		}//needed in post mode
		//counter-anit-scraping
		xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 5.1; rv:37.0) Gecko/20100101 Firefox/37.0');
		xhr.send()
		popUpNotification("in asyn... request sent")//DEBUG)
	})
}

//根据关键字列表索取youtube页面
function searchListOnline(list) {
	let url
	let list_p = new Array(list.length);
	for (let i = 0; i < list.length; i++) {
		if(list[i].channel != "") {
			if(list[i].channelUrl != "") {
				url = "https://www.youtube.com/" + list[i].channelUrl + "/search?sp=CAI%253D&query=" + list[i].self.split(';').join(' ');
				console.log(i + "th " + url);
				list_p[i] = asynHttpRequest("GET", url);
			} else {
				// 需要更新channel信息
			}
		} else {
			url = "https://www.youtube.com/results?sp=CAI%253D&search_query=" + list[i].self.split(';').join(' ');
			console.log(i + "th " + url);
			list_p[i] = asynHttpRequest("GET", url);
		}
	}
	return Promise.all(list_p);
}

// 得到channel对应的编号
function searchChannelNum(KeyWord) {
	
	// 目前只有阅后即瞎一个频道的number
	if (KeyWord.channel == "阅后即瞎 - 官方频道") {
		KeyWord.channelUrl = "channel/UCHCb7_nHscX38PI0L182GGA";
	}
	if (KeyWord.channel == "湖南卫视芒果TV官方频道 China HunanTV Official Channel") {
		KeyWord.channelUrl = "user/imgotv";
	}

}



// 获得视频信息
function getVideoInfo(il_video) {
	/*\ 
	|| 
	\*/

	titleObj = $(il_video).find("a.yt-uix-tile-link.yt-ui-ellipsis.yt-ui-ellipsis-2.yt-uix-sessionlink.spf-link");
	var title = $(titleObj).text();
	var videoUrl = $(titleObj).attr("href");
	
	//获取时长,和封面
	coverObj = $(il_video).find("a.yt-uix-sessionlink.spf-link").find("div.yt-thumb.video-thumb").find("span.yt-thumb-simple");

	var coverUrl_onload = $(coverObj).find("img").attr("data-thumb"); 
	if( coverUrl_onload === undefined) {
		var coverUrl = $(coverObj).find("img").attr("src");
	}else {
		var coverUrl = coverUrl_onload;
	}

	var videoTime = $(coverObj).find("span").text();
	
	// 获取频道信息
	channelObj = $(il_video).find("div.yt-lockup-content").find("div.yt-lockup-byline").find("a.yt-uix-sessionlink.spf-link");
	var channelName = $(channelObj).text();
	var channelUrl = $(channelObj).attr("href");
	
	// 获取更新时间
	timeObj = $(il_video).find("div.yt-lockup-content").find("div.yt-lockup-meta").find("ul.yt-lockup-meta-info");
	//timeObj = $(il_video).find("ul.yt-lockup-meta-info");
	uptimeli = $(timeObj).find("li").toArray()[0];
	uptimeStr = $(uptimeli).text();
	

	vInfo= new infoVideo(il_video,title,videoUrl,coverUrl,videoTime,channelName,channelUrl,uptimeStr, new Date());
	
	return vInfo;
	// vInfo.show();
	
}
// satisfyKeyWord
// 判断视频是否满足Keyword
function satisfyKeyWord(keyWord,vInfo) {
	

	satisfied = true;

	// 是否是指定频道
	if (keyWord.channel != '' && vInfo.channelName != keyWord.channel){
		satisfied = satisfied && false;
		console.log(vInfo.channelName);
		console.log(keyWord.channel);
		console.log('false channel');
		return satisfied;

	}
	
	// 是否包含key word
	list_world = keyWord.self.split(';');

	for (let i = 0; i < list_world.length; i++) {
		satisfied = satisfied && vInfo.title.includes($.trim(list_world[i]));
		if( !  satisfied){
			//console.log('+++++++++');
			//console.log(vInfo.title);
			//console.log(list_world[i]);
			return satisfied;
		}
	}
	return satisfied;
}


// 过滤搜索页
function filterSearch(list_Keyword, list_SearchResults) {
		/*\ 
		|| 根据关键字过滤搜索页
		\*/
	let list_vInfo = new Array();
	if (list_SearchResults.length != list_Keyword.length){
		console.log("-----length neq-----");
		//长度不等
		return;
	}
	for (let i = 0; i < list_SearchResults.length; i++) {
		// console.log( "K : " +  i + '------------');
		// string to Document
		// doc = $.parseHTML(list_SearchResults[i]);
		doc = $($(list_SearchResults[i]))
		if(list_Keyword[i].channel == ''){
			doc.find('[id*=item-section-]').children().each(function( index ) {
	  			// console.log( "P : " + index + '------------');
				//console.log(this);

				vInfo = getVideoInfo(this);
				if (satisfyKeyWord(list_Keyword[i],vInfo) ) {
					// vInfo.show();
					list_vInfo.push(vInfo);
				}else {
					// console.log("not satisfied keyword.");
				}
			
			});
		}else{
		// 在频道搜索
			doc.find('li.feed-item-container.yt-section-hover-container.browse-list-item-container.branded-page-box').each(function( index ) {
	  			// console.log( "P : " + index + '------------');
				//console.log(this);

				vInfo = getVideoInfo(this);
				if (satisfyKeyWord(list_Keyword[i],vInfo) ) {
					// vInfo.show();
					list_vInfo.push(vInfo);
				}else {
					// console.log("not satisfied keyword.");
				}
			
			});

		}

	}
	
	return list_vInfo;
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
let list_SearchResults = new Array();



if(jQuery){
	console.log("jQuery loaded")
}

console.log("开始初始化");
// 目前只储存两个
list_KeyWord[0] = new keyWord("爸爸去哪儿5;完整版;ENG SUB","湖南卫视芒果TV官方频道 China HunanTV Official Channel");
list_KeyWord[1] = new keyWord("老师;","阅后即瞎 - 官方频道");
//list_KeyWord[2] = new keyWord("爸爸去哪儿5 ENG SUB","湖南卫视芒果TV官方频道 China HunanTV Official Channel");

// 寻找youtuber对应字符
for (let i = 0; i < list_KeyWord.length; i++) {
	searchChannelNum(list_KeyWord[i]);
}


console.log("初始化完成");


// 输出关键字信息
console.log("list_length :" + list_KeyWord.length);
for (let i = 0; i < list_KeyWord.length; i++) {
	console.log((i + 1), "-th \n关键词 : " + list_KeyWord[i].self + "\nchannel : " + list_KeyWord[i].channel + "\nchannel Url : " + list_KeyWord[i].channelUrl );
}
console.log("----------");


browser.browserAction.onClicked.addListener(() => {
	// 筛选出符合关键词的视频
	let list_vedio = new Array();
	searchListOnline(list_KeyWord).then((list_SearchResults) => {
		console.log("final:");
		//console.log(list_SearchResults)
		console.log(list_SearchResults.length);
		list_vedio.push.apply(list_vedio, filterSearch(list_KeyWord,list_SearchResults));
		console.log("num video : ", list_vedio.length);
		// debug
		for (let i = 0; i < list_vedio.length; i++) {
			console.log("<-----" + i+"-th video----->");
			list_vedio[i].show();
		}
	});
})




