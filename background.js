function popUpNotification(message) {
  var myTime = new Date()
  console.log("%c" + myTime.toTimeString() + "mark No.1", "color:#00ff00");
  browser.notifications.create({
    "type": "basic",
    "title": "Hey boy",
    "message": message
  });
}

xmlHttp = new XMLHttpRequest()
// xmlHttp.onreadystatechange = () => {
//   if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
//     popUpNotification("got web page " + xmlHttp.status + " " + xmlHttp.status + xmlHttp.responseText.length)
//     console.log(xmlHttp.response)
//     console.log(document)
//     // document.write("<h1>This is a heading</h1>")
//     var newDiv = document.createElement("div")
//     var newContent = document.createTextNode("Hi, test")
//     newDiv.appendChild(newContent)
//   }
// }
xmlHttp.onload = () => {
  popUpNotification("got web page ")// + xmlHttp.status + " " + xmlHttp.status + xmlHttp.responseText.length)
  console.log(xmlHttp.response)
  var blobFile = new Blob([xmlHttp.response], { type: "text/html" })
  var blobUrl = URL.createObjectURL(blobFile)
  var creating = browser.tabs.create({
    url: blobUrl
  })
  // console.log(document)
  // // document.write("<h1>This is a heading</h1>")
  // var newDiv = document.createElement("div")
  // var newContent = document.createTextNode("Hi, test")
  // newDiv.appendChild(newContent)
}
xmlHttp.onerror = () => {
  popUpNotification("Error")
}

browser.browserAction.onClicked.addListener(() => {
  // xmlHttp.open("GET", "https://www.youtube.com/results?search_query=阅后即瞎", true)
  xmlHttp.open("GET", "https://www.google.com/search?newwindow=1&safe=active&dcr=0&biw=1304&bih=696&ei=K-owWpSzFuy-jwTQqbfAAg&q=embed+jquery+in+firefox+extension&oq=embed+jquery+in+firefox+extension&gs_l=psy-ab.3...20577.23443.0.25372.10.10.0.0.0.0.447.1685.3-4j1.5.0....0...1c.1.64.psy-ab..5.0.0....0.uw-3fa8pVW0", true)
  // xmlHttp.open("GET", "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=2&tn=baiduhome_pg&wd=%E9%98%85%E5%90%8E%E5%8D%B3%E7%9E%8E&rsv_spt=1&oq=%25E9%2598%2585%25E5%2590%258E%25E5%258D%25B3%25E7%259E%258E&rsv_pq=c48ed0d400000944&rsv_t=7e59CNkqYBPgB973WCHCiRE%2B%2BgyHHJFCaFsv7kb2fsPY4xsE8bujUuhE7MgIF0RWdK6u&rqlang=cn&rsv_enter=0&rsv_sug=1", true)
  xmlHttp.responseType = "text"
  xmlHttp.send()
  popUpNotification("request has been sent...waiting for respond")
  // var creating = browser.tabs.create({
  //   url:"https://example.org"
  // });
  // creating.then(onCreated, onError);
})

//moz-extension://5e3adf10-b4c4-4c14-8df4-1c801cbe68d7/_generated_background_page.html
//data:image/png;base64,iVBORw0KGgoAAAAN...actually the whole picture