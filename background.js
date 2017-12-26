//for debug
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
		// popUpNotification("in asyn... request sent")//DEBUG)
	})
}

function searchListOnline(list) {
	let url
	let list_p = new Array(list.length);
	for (let i = 0; i < list.length; i++) {
		url = "https://www.youtube.com/results?search_query=" + list[i].self
		console.log(i + "th " + url)
		list_p[i] = asynHttpRequest("GET", url)
	}
	return Promise.all(list_p)
}

//not used, moved from content script, temp[i].offsetParent might be handy
function searchLinkOnPage(keyWord) {
    let temp = document.getElementsByTagName("a");
    //get all link
    console.log("got " + temp.length +" links in total");
    for (let i = 0; i < temp.length; i++) {
        if (temp[i].offsetParent != null && temp[i].innerText.search(keyWord) != -1) {
            //check if it is visible && search keyword
            console.log(temp[i].innerText);
        }
    }
}

//=================================START FROM HERE=============================
// 关键词储存在类里
// 类KeyWord
// self 储存关键字, 空为不指定

// 储存关键词
let list_KeyWord = new Array();
// 关键词对应的搜索页面
let list_SearchResults = new Array();

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
	// searchListOnline(list_KeyWord).then((e) => {
	// 	console.log("final:")
	// 	console.log(e)
	// })
	//browser.storage.local.get("color").then((e)=>{popUpNotification(e.color)})
	browser.runtime.openOptionsPage()
})
