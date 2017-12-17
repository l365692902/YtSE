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
				url = "https://www.youtube.com/" + list[i].channelUrl + "/search?query=" + list[i].self;
				console.log(i + "th " + url);
				list_p[i] = asynHttpRequest("GET", url);
			} else {
				// 需要更新channel信息
			}
		} else {
			url = "https://www.youtube.com/results?search_query=" + list[i].self;
			console.log(i + "th " + url);
			list_p[i] = asynHttpRequest("GET", url);
		}
	}
	return Promise.all(list_p);
}

// 得到channel对应的编号
function searchChannelNum(KeyWord) {
	
	// 目前只有阅后即瞎一个频道的number
	if (KeyWord.channel == "阅后即瞎") {
		KeyWord.channelUrl = "channel/UCHCb7_nHscX38PI0L182GGA";
	}
	if (KeyWord.channel == "湖南卫视芒果TV官方频道 China HunanTV Official Channel") {
		KeyWord.channelUrl = "user/imgotv";
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
let list_SearchResults = new Array();


console.log("开始初始化");
// 目前只储存两个
list_KeyWord[0] = new keyWord("【阅后即瞎】");
list_KeyWord[1] = new keyWord("老师","阅后即瞎");
list_KeyWord[2] = new keyWord("Dad Where Are We Going S04","湖南卫视芒果TV官方频道 China HunanTV Official Channel");

// 寻找youtuber对应字符
searchChannelNum(list_KeyWord[0]);
searchChannelNum(list_KeyWord[1]);
searchChannelNum(list_KeyWord[2]);

console.log("初始化完成");


// 输出关键字信息
console.log("list_length :" + list_KeyWord.length);
for (let i = 0; i < list_KeyWord.length; i++) {
	console.log((i + 1), "-th \n关键词 : " + list_KeyWord[i].self + "\nchannel : " + list_KeyWord[i].channel + "\nchannel Url : " + list_KeyWord[i].channelUrl );
}
console.log("----------");


browser.browserAction.onClicked.addListener(() => {
	searchListOnline(list_KeyWord).then((list_SearchResults) => {
		console.log("final:")
		//console.log(list_SearchResults)
		console.log(list_SearchResults.length)
	})
})




