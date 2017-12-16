function popUpNotification(message) {
	browser.notifications.create({
		"type": "basic",
		"title": "Hey boy",
		"message": message
	});
}

class keyWord {
	constructor(keyWord = "", youTuber = "", channel = "", playList = "") {
		this.self = keyWord
		this.youTuber = youTuber
		this.channel = channel
		this.playList = playList
	}
}

function checkResponse(xhr) {
	// console.log(xhr.response)
	// console.log(xhr.getResponseHeader("Content-Type"))
	var blobFile = new Blob([xhr.response], { type: "text/html;charset=UTF-8" })
	// var blobFile = new Blob([xmlHttp.response], { type: "text/plain;charset=UTF-8" })
	var blobUrl = URL.createObjectURL(blobFile)
	var creating = browser.tabs.create({
		url: blobUrl
	})
}

//promised asynchronous xmlHttpRequest
function pmdAsynHttpRequest(method, url) {
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
		// popUpNotification("in asyn... request sent")//DEBUG)
	})
}

//not used
function searchKeyWord(KeyWord) {
	// 搜索页面网址
	if (KeyWord.word + KeyWord.channel + KeyWord.channel == '') {
		console.log("error: empty KeyWord");
	}
	var url = "https://www.youtube.com/results?search_query=" + KeyWord.word;
	if (KeyWord.channel /= '') {

	}
	if (KeyWord.list /= '') {

	}
	if (KeyWord.channel /= '') {

	}
	if (debug) {
		console.log("search url : " + url);
	}
	//用于创建XMLHttpRequest对象
	var xmlHttp = new XMLHttpRequest();                  //FireFox、Opera等浏览器支持的创建方式

	var searchResult //储存返回内容
	//设置回调函数
	xmlHttp.onload = () => {
		popUpNotification("got web page ")// + xmlHttp.status + " " + xmlHttp.status + xmlHttp.responseText.length)
		checkResponse(xmlHttp)
		searchResult = xmlHttp.response
	}
	xmlHttp.onerror = () => {
		popUpNotification("Error")//debug use, will be removed after
	}
	xmlHttp.open("GET", url, true); //不使用异步
	// xmlHttp.responseType = "text"
	// xmlHttp.setRequestHeader ('Accept', 'text/html');
	// xmlHttp.setRequestHeader ('Content-Type', 'application/x-www-form-urlencoded');//this line comes with "POST"
	// xmlHttp.setRequestHeader ('Content-Length', '19' );
	// xmlHttp.setRequestHeader ('Accept-Charset', 'utf-8' );
	xmlHttp.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 5.1; rv:43.0) Gecko/20100101 Firefox/43.0')
	xmlHttp.send();
	popUpNotification("request has been sent...waiting for response")
	return searchResult;
}

function searchList(list) {
	var url
	var list_p = new Array(list.length);
	for (let i = 0; i < list.length; i++) {
		url = "https://www.youtube.com/results?search_query=" + list[i].self
		console.log(i + "th " + url)
		list_p[i] = pmdAsynHttpRequest("GET", url)
	}
	return Promise.all(list_p)
}

//======================================================START FROM HERE===============================
// 关键词储存在对象里
// 对象KeyWord
// word 储存关键字, 空为不指定
// channel 储存所属频道, 空为不指定
// list 储存关键字所属列表, 空为不指定
// word channel list 三个变量不能同时为零

// 储存关键词
var list_KeyWord = new Array();
// 关键词对应的搜索页面
var list_SearchResults = new Array();

console.log("开始初始化");
// 目前只储存两个
list_KeyWord[0] = new keyWord("阅后即瞎")
list_KeyWord[1] = new keyWord("爸爸去哪")
// 输出关键字信息
console.log("初始化完成");
console.log("list_length :" + list_KeyWord.length);
for (let i = 0; i < list_KeyWord.length; i++) {
	console.log((i + 1), "-th 关键词 : " + list_KeyWord[i].self);
}
console.log("----------");


browser.browserAction.onClicked.addListener(() => {
	searchList(list_KeyWord).then((e) => {
		console.log("final:")
		console.log(e)
	})
})
