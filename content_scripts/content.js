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
	
});