//================================FUNCTIONS====================================


// =============================START FROM HERE================================
//let test=new keyWord("this is a test")
//test.show()
//window.alert("Hey boy")





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
	Obj = $("div.multirow-shelf").find("ul.shelf-content").find("li.yt-shelf-grid-item");
	//console.log("<li class=\"yt-shelf-grid-item\">"+list_vedio[0].il +"</li>");
	$(Obj).each(function(index){
		if(index == 0){
			$("<li class=\"yt-shelf-grid-item\">"+
			list_vedio[0].il +
			"</li>").insertAfter($(this));
		}
		
	});
		
	
	});
});