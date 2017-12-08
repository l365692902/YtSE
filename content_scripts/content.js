function findLinkByKeyWord(keyWord) {
    var temp = document.getElementsByTagName("a")
    //get all link
    console.log("got " + temp.length +" links in total")
    for (var i = 0; i < temp.length; i++) {
        if (temp[i].offsetParent != null && temp[i].innerText.search(keyWord) != -1) {
            //check if it is visible && search keyword
            console.log(temp[i].innerText)
        }
    }
}

var myTime = new Date();
console.log("%c"+myTime.toTimeString() + ": this is line 1 of content.js","color:#00ff00");

findLinkByKeyWord("完整版")