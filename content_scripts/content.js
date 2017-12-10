// 一些依赖库
// var superagent = require("superagent");

var debug = true;


function findLinkByKeyWord(keyWord) {
    var temp = document.getElementsByTagName("a");
    //get all link
    console.log("got " + temp.length +" links in total");
    for (var i = 0; i < temp.length; i++) {
        if (temp[i].offsetParent != null && temp[i].innerText.search(keyWord) != -1) {
            //check if it is visible && search keyword
            console.log(temp[i].innerText);
        }
    }
}


function InnitialKeyWorld(list_KeyWord){

// 目前只储存两个

list_KeyWord[0] = new Object();
list_KeyWord[0].word = "阅后即瞎";
list_KeyWord[0].channel = "";
list_KeyWord[0].list = "";

list_KeyWord[1] = new Object();
list_KeyWord[1].word = "爸爸去哪";
list_KeyWord[1].channel = "";
list_KeyWord[1].list = "";


}

function GetSearchResultsByKeyWord(KeyWord){

// 搜索页面网址
if(KeyWord.word +KeyWord.channel + KeyWord.channel == ''){
	console.log("error: empty KeyWord");
}

var url = "https://www.youtube.com/results?search_query="+KeyWord.word;


if (KeyWord.channel /= '') {

}
if (KeyWord.list /= '') {

}
if (KeyWord.channel /= '') {

}

if( debug) {
console.log("search url : "+ url);
}


//用于创建XMLHttpRequest对象
//if (window.XMLHttpRequest) {
xmlHttp = new XMLHttpRequest();                  //FireFox、Opera等浏览器支持的创建方式
//} else {
//	xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");//IE浏览器支持的创建方式
//}

var SearchResults = ''; //储存返回内容

//设置回调函数
xmlHttp.onreadystatechange = function(){

	if (xmlHttp.readyState == 4) {
		// 输出
		//console.log("test");
        	SearchResults = xmlHttp.responseText;
		// console.log("1 : length of results : " + SearchResults.length);

    	}
	
};
xmlHttp.open("GET", url, false); //不使用异步
xmlHttp.send(null);
return SearchResults;
}

function GetResearchList(list_KeyWord,list_Results){
	
	var list_p = new Array(list_KeyWord.length);
	for (let i=0; i < list_KeyWord.length; i++){
		var temp = i;
		list_p[temp] = new Promise(function(){
			list_Results[temp] = GetSearchResultsByKeyWord(list_KeyWord[temp]);
		});
	}
	//获取全部状态
	var p_all = Promise.all(list_p);
	//等待执行完毕
	p_all.then();
}


// =============================================
var myTime = new Date();
console.log("%c"+myTime.toTimeString() + ": this is line 1 of content.js","color:#00ff00");



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


// 初始化Keyword列表, 
// 目前长度为1 , 内容为 阅后即瞎
if (debug) {
console.log("开始初始化");
}
InnitialKeyWorld(list_KeyWord);

if (debug) {
// 输出关键字信息
console.log("初始化完成");
console.log("num :" +list_KeyWord.length);
for (i=0;i<list_KeyWord.length;i++){
	console.log((i+1),"-th 关键词 : " + list_KeyWord[i].word);
}
console.log("----------");
}


// 获取搜索页面
GetResearchList(list_KeyWord,list_SearchResults);


if ( debug) {
	
	for (i=0; i< list_SearchResults.length; i++){
		console.log( (i+1) +"-th : length of results : " + list_SearchResults[i].length);
	}
//console.log(list_SearchResults[0]);
}




