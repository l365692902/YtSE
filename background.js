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
		this.playListUrl = ''

	};
	
	show(){
		console.log("------->");
		console.log("keyword : " + this.self);
		console.log("channel : " + this.channel);
		console.log("channelUrl : " + this.channelUrl);
		console.log("playList : " + this.playList);
		console.log("playListUrl : " + this.playListUrl);
		console.log("<-------");
		return;
	};

}

class infoVideo {
	constructor(il = "", title = "", videoUrl = "", coverUrl = "", videoTime = "", channelName = "", channelUrl = "", upTime = "", time = "") {
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


	show() {

		console.log("title : ", this.title);
		console.log("video Url : ", this.videoUrl);
		console.log("cover : ", this.coverUrl);
		console.log("last time : ", this.videoTime);
		console.log("channel : ", this.channelName);
		console.log("channel url : ", this.channelUrl);
		console.log("uptime : ", this.upTime);
		console.log("time : ", this.time);
		return;

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
		popUpNotification("in asyn... request sent");//DEBUG)
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
function removeNChar(str){
	var result="";
	//console.log(str.length);
	for (var i = 0; i < str.length; i++){
		//console.log(str[i],str.charCodeAt(i));
		if (str.charCodeAt(i)==12298 ){ //《
			result+= " "; //String.fromCharCode(str.charCodeAt(i)-12256);
		}else if (str.charCodeAt(i)==12299 ){ //》
			result+= " "; //String.fromCharCode(str.charCodeAt(i)-12256);
		}else{
			result+= String.fromCharCode(str.charCodeAt(i));
		}
	}
  return result;
}

// convertTime
function convertAbTime2Int(timeStr) {
		/*\ 
		|| 将字符串返回的时间,给出整数时间
		|| 该函数给出的是绝对时间
		\*/
	//console.log(timeStr);
	
	list_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	if(timeStr.includes("年")){
	// 中文
		var year = parseInt(timeStr.split("年")[0]);
		var month = parseInt(timeStr.split("年")[1].split("月")[0]);
		var day = parseInt(timeStr.split("年")[1].split("月")[1].split("日")[0]);
		var timeDate = new Date(year,month,day);
		
		return timeDate.valueOf();
	}else if(list_month.indexOf(timeStr.substring(0,3)) >= 0){
		var month = list_month.findIndex(function (element){
			return timeStr.substring(0,3) == element ;
		}) + 1;
		
		var day = parseInt(timeStr.substring(4).split(",")[0]);
		var year = parseInt(timeStr.substring(4).split(",")[1]);
		
		var timeDate = new Date(year,month,day);
		
		return timeDate.valueOf();
	}
}

function convertReTime2Int(timeStr) {
		/*\ 
		|| 将字符串返回的时间,给出整数时间
		|| 该函数给出的是相对时间
		\*/
	
	list_Zh = ["年前", "个月前", "天前", "周前", "小时前", "分钟前"];
	list_En = ["hour ago", "hours ago", "week ago", "weeks ago", "day ago", "days ago", "year ago", "years ago", "minute ago", "minutes ago", "month ago", "months ago"];
	
	// 曾经直播标志
	var stream_Zh = "直播时间：";
	var stream_Zhf= "曾經串流";
	var stream_En = "Streamed";

	
	var timeStr_local
	if(timeStr.includes("前")){
		if(timeStr.includes(stream_Zh)){
			timeStr_local = timeStr.substring(stream_Zh.length);
		}else if(timeStr.includes(stream_Zhf)){ //5 小時前曾經串流
			timeStr_local = timeStr.substring(0,timeStr.length-stream_Zhf.length);
		}else{
			timeStr_local = timeStr;
		}
		if(timeStr_local.includes("年前")){
			var timel = "年前";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*31557600000;
		}else if(timeStr_local.includes("个月前")){
			var timel = "个月前";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*2629800000;
		}else if(timeStr_local.includes("個月前")){
			var timel = "個月前";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*2629800000;
		}else if(timeStr_local.includes("天前")){
			var timel = "天前";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*86400000;
		}else if(timeStr_local.includes("周前")){
			var timel = "周前";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*604800016;
		}else if(timeStr_local.includes("週前")){
			var timel = "週前";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*604800016;
		}else if(timeStr_local.includes("小时前")){
			var timel = "小时前";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*3600000;
		}else if(timeStr_local.includes("小時前")){
			var timel = "小時前";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*3600000;
		}else if(timeStr_local.includes("分钟前")){
			var timel = "分钟前";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*60000;
		}else if(timeStr_local.includes("分鐘前")){
			var timel = "分鐘前";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*60000;
		}else if(timeStr_local.includes("今日")){
			var timel = "今日";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*43200000; // 0.5 day
		}else{
			// 没有合适的
			console.log("error : no switched time tag : " + timeStr_local);
			return 0;
		}

	} else if(timeStr.includes("ago")){
	// 英文
		if(timeStr.includes(stream_En)){
			timeStr_local = timeStr.substring(stream_En.length);
		}else{
			timeStr_local = timeStr;
		}	
		if(timeStr_local.includes("year ago")){
			var timel = "year ago";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*31557600000;
		}else if(timeStr_local.includes("years ago")){
			var timel = "years ago";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*31557600000;
		}else if(timeStr_local.includes("month ago")){
			var timel = "month ago";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*2629800000;
		}else if(timeStr_local.includes("months ago")){
			var timel = "months ago";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*2629800000;
		}else if(timeStr_local.includes("day ago")){
			var timel = "day ago";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*86400000;
		}else if(timeStr_local.includes("days ago")){
			var timel = "days ago";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*86400000;
		}else if(timeStr_local.includes("week ago")){
			var timel = "week ago";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*604800016;
		}else if(timeStr_local.includes("weeks ago")){
			var timel = "weeks ago";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*604800016;
		}else if(timeStr_local.includes("hour ago")){
			var timel = "hour ago";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*3600000;
		}else if(timeStr_local.includes("hours ago")){
			var timel = "hours ago";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*3600000;
		}else if(timeStr_local.includes("minute ago")){
			var timel = "minute ago";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*60000;
		}else if(timeStr_local.includes("minutes ago")){
			var timel = "minutes ago";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*60000;
		}else if(timeStr_local.includes("today")){
			var timel = "today";
			var cont = parseInt(timeStr_local.substring(0,timeStr_local.length-timel.length));
			//console.log(cont);
			return -cont*43200000;
		}else{
			// 没有合适的
			console.log("error : no switched time tag : " + timeStr_local);
			return 0;
		}
	}
}

// 获得视频信息
function getVideoInfo(il_video) {
	/*\ 
	|| 
	\*/
	if($(il_video).find("ul.yt-lockup-meta.yt-lockup-playlist-items").length > 0){
	// 在对channel页面进行搜索的时候无法屏蔽列表,所以这里过滤一下是否为列表
		//该条目是列表
		vInfo = new infoVideo(il_video);
		return vInfo;
	}else{
	// 不是列表
		titleObj = $(il_video).find("a.yt-uix-tile-link.yt-ui-ellipsis.yt-ui-ellipsis-2.yt-uix-sessionlink.spf-link");
		var title = $(titleObj).text();
		var videoUrl = $(titleObj).attr("href");
	
		//获取时长,和封面
		coverObj = $(il_video).find("a.yt-uix-sessionlink.spf-link").find("div.yt-thumb.video-thumb").find("span.yt-thumb-simple");
	
		var coverUrl_onload = $(coverObj).find("img").attr("data-thumb");
		if (coverUrl_onload === undefined) {
			var coverUrl = $(coverObj).find("img").attr("src");
		} else {
			var coverUrl = coverUrl_onload;
		}
	
		var videoTime = $(coverObj).find("span").text();
		//console.log(videoTime);
		// 获取频道信息
		channelObj = $(il_video).find("div.yt-lockup-content").find("div.yt-lockup-byline").find("a.yt-uix-sessionlink.spf-link");
		var channelName = $(channelObj).text();
		var channelUrl = $(channelObj).attr("href");
	
		// 获取更新时间
		timeObj = $(il_video).find("div.yt-lockup-content").find("div.yt-lockup-meta").find("ul.yt-lockup-meta-info");
		var tNow = new Date();
		if($(timeObj).find("li").toArray().length == 2){
			uptimeli = $(timeObj).find("li").toArray()[0];
			uptimeStr = convertReTime2Int($(uptimeli).text())+tNow.valueOf();
		}else{
			// 可能在直播
			if($(il_video).find("div.yt-lockup-content").find("div.yt-lockup-badges").find("ul.yt-badge-list").find("span.yt-badge.yt-badge-live").length > 0){
				// 在直播
				uptimeStr = tNow.valueOf();
			}else{
				// 不知道类别
				uptimeStr = tNow.valueOf();
			}
		}
		

	
		vInfo = new infoVideo(il_video, title, videoUrl, coverUrl, videoTime, channelName, channelUrl, uptimeStr, tNow);
		
		//vInfo.show();
		return vInfo;

	}
	
	// vInfo.show();

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
function updatePlayListInfo(vInfo, ListPage){
	
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
	
	if(uptimeStr.includes(Zhtime1)){
	// 繁体中文 "上次更新時間：xxxx年xx月xx日"
		var timeStr = uptimeStr.substring(Zhftime1.length);
		
		vInfo.upTime = convertAbTime2Int(timeStr);
		
	} else if(uptimeStr.includes(Zhtime1)){
	// 中文 "最后更新时间：xxxx年xx月xx日"
		var timeStr = uptimeStr.substring(Zhtime1.length);
		
		vInfo.upTime = convertAbTime2Int(timeStr);
		
	} else if(uptimeStr.includes(Zhtime2)){
	// 中文 "几天前更新"
		var timeStr = uptimeStr.substring(0, uptimeStr.length-Zhtime2.length);
		var tNow = new Date();
		vInfo.upTime = convertReTime2Int(timeStr)+ tNow.valueOf();;
		
	} else if(uptimeStr.includes(Entime2)){
	// 英文 Last updated on Jul xx,xxxx
		var timeStr = uptimeStr.substring(Entime2.length);
		
		vInfo.upTime = convertReTime2Int(timeStr);
	} else if(uptimeStr.includes(Entime1)){
	// 英文 Updated xx days ago
		var timeStr = uptimeStr.substring(Entime1.length);
		var tNow = new Date();
		vInfo.upTime = convertAbTime2Int(timeStr)+ tNow.valueOf();
	} else{
		// 其他语言,没法分析
	}
	
}


// satisfyKeyWord
// 判断视频是否满足Keyword
function satisfyKeyWord(keyWord, vInfo) {


	satisfied = true;

	// 是否是指定频道
	if (keyWord.channel != '' && vInfo.channelName != keyWord.channel) {
		satisfied = satisfied && false;
		//console.log(vInfo.channelName);
		//console.log(keyWord.channel);
		//console.log('false channel');
		//console.log("--------");
		return satisfied;

	}
	
	// 是否是指定的list
	if (keyWord.playList != '' ) {
		if(vInfo.title == keyWord.playList){
			satisfied = satisfied && true;
			//console.log(vInfo.title);
			return satisfied;
		}else{
			satisfied = satisfied && false;
			//console.log(vInfo.title);
			//console.log('false list');
			return satisfied;	
		}
	}
	
	if(keyWord.self.length > 0){
		// 是否包含key word
		list_world = keyWord.self.split(';');
	
		for (let i = 0; i < list_world.length; i++) {
			satisfied = satisfied && vInfo.title.includes($.trim(list_world[i]));
			if (!satisfied) {
				//console.log('+++++++++');
				//console.log(vInfo.title);
				//console.log(list_world[i]);
				return satisfied;
			}
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
	if (list_SearchResults.length != list_Keyword.length) {
		console.log("-----length neq-----");
		//长度不等
		return;
	}
	for (let i = 0; i < list_SearchResults.length; i++) {
		// console.log( "K : " +  i + '------------');
		// string to Document
		// doc = $.parseHTML(list_SearchResults[i]);
		doc = $($(list_SearchResults[i]))
		if(list_Keyword[i].playList == ""){
			if (list_Keyword[i].channel == '') {
				doc.find('[id*=item-section-]').children().each(function (index) {
					// console.log("P : " + index + '------------');
					//console.log(this);
	
					vInfo = getVideoInfo(this);
					// vInfo.show();
					if (satisfyKeyWord(list_Keyword[i], vInfo)) {
						// vInfo.show();
						list_vInfo.push(vInfo);
					} else {
						// console.log("not satisfied keyword.");
					}
	
				});
			} else {
				// 在频道搜索
				doc.find('li.feed-item-container.yt-section-hover-container.browse-list-item-container.branded-page-box').each(function (index) {
					// console.log( "P : " + index + '------------');
					//console.log(this);
	
					vInfo = getVideoInfo(this);
					if (satisfyKeyWord(list_Keyword[i], vInfo)) {
						// vInfo.show();
						list_vInfo.push(vInfo);
					} else {
						// console.log("not satisfied keyword.");
					}
	
				});
	
			}							
		}else{
		// playlist不为空
			doc.find('[id*=item-section-]').children().each(function (index) {
				// console.log("P : " + index + '------------');
				//console.log(this);

				vInfo = getPlayListInfo(this);
				// vInfo.show();
				if (satisfyKeyWord(list_Keyword[i], vInfo)) {
					// vInfo.show();
					list_vInfo.push(vInfo);
				} else {
					// console.log("not satisfied keyword.");
				}

			});		
		}

	}

	return list_vInfo;
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
function initialUrl(key_word){
	// class赋值 直接 key_word_local=key_word 是指针, 两个变量指向一个地址
	let key_word_local = new  keyWord(key_word.self,key_word.channel,key_word.playList);

	console.log("----查找URL------");
	//key_word_local.show();
	//console.log(key_world.playList)
	let vedio = new Array();
	key_word_local.self = "";
	
	
	if(key_word.playList != "" || key_word.channel != "" ){
		searchListOnline([key_word_local]).then((list_SearchResults) => {
			
			//console.log("initial final : ",list_SearchResults.length);
			//console.log(list_SearchResults)
			//key_word_local.show();
			if( key_word.playList != "" && key_word.playListUrl == ""){
				//key_word.show();
				console.log("查找play list");
				////key_word.show();
				vedio.push.apply(vedio, filterSearch([key_word_local],list_SearchResults));
			}else if(key_word.channel != "" && key_word.channelUrl == ""){
				//key_word.show();
				console.log("查找channel");
				////key_word.show();
				vedio.push.apply(vedio, filterChannelSearch([key_word_local],list_SearchResults));
			}
			
			//console.log("initial num video : ", vedio.length);
			// debug
	
			if(vedio.length >0){
			// 我们只用查找出来第一个的
				//vedio[0].show();
				if( key_word.playList != "" && key_word.playListUrl == ""){
					//需要查找playlist的URL
					
					//key_word_local.show();
					key_word.channel = vedio[0].channelName;
					key_word.channelUrl = vedio[0].channelUrl;
					key_word.playListUrl = vedio[0].videoUrl;
					console.log("找到play list");
					//key_word.show();		
				}else if(key_word.channel != "" && key_word.channelUrl == ""){
					
					key_word.channel = vedio[0].channelName;
					key_word.channelUrl = vedio[0].channelUrl;
					console.log("找到Channel");
					//key_word.show();
				}
	
			}else{
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


list_KeyWord[0] = new keyWord("爸爸去哪儿5;完整版;ENG SUB","湖南卫视芒果TV官方频道 China HunanTV Official Channel");
list_KeyWord[1] = new keyWord("", "", "Season One - THE Acapella Producer");
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


console.log("初始化完成");
//convertReTime2Int("2 小时前");

// 输出关键字信息
//console.log("list_length :" + list_KeyWord.length);
//for (let i = 0; i < list_KeyWord.length; i++) {
//	console.log((i + 1), "-th \n关键词 : " + list_KeyWord[i].self + "\nchannel : " + list_KeyWord[i].channel + "\nchannel Url : " + list_KeyWord[i].channelUrl);
//}
//console.log("----------");


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
		//for (let i = 0; i < list_vedio.length; i++) {
		//	console.log("<-----" + i+"-th video----->");
		//	list_vedio[i].show();
		//}		
		
		return searchPlayListOnline(list_KeyWord);
	}).then((list_Playlistmainpage) => {
		console.log("final:");
		console.log("num video : ", list_vedio.length);
		console.log(list_Playlistmainpage.length);
		
		// 或得playList更新时间
		for (let i = 0; i < list_KeyWord.length; i++) {
			if(list_KeyWord[i].playList != ""){
				updatePlayListInfo(list_vedio[i],list_Playlistmainpage[i])
			}
		}			
		//list_vedio.push.apply(list_vedio, filterSearch(list_KeyWord,list_SearchResults));
		//console.log("num video : ", list_vedio.length);
		//// debug
		for (let i = 0; i < list_vedio.length; i++) {
			console.log("<-----" + i+"-th video----->");
			list_vedio[i].show();
		}
	});
})




