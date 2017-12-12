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
  popUpNotification("got web page " + xmlHttp.status + " " + xmlHttp.status + xmlHttp.responseText.length)
  console.log(xmlHttp.response)
  var blobFile = new Blob([xmlHttp.response], { type: "text/plain" })
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
  xmlHttp.open("GET", "https://www.youtube.com/results?search_query=阅后即瞎", true)
  xmlHttp.send()
  popUpNotification("request has been sent...waiting for respond")
  // var creating = browser.tabs.create({
  //   url:"https://example.org"
  // });
  // creating.then(onCreated, onError);
})

//moz-extension://5e3adf10-b4c4-4c14-8df4-1c801cbe68d7/_generated_background_page.html
//data:image/png;base64,iVBORw0KGgoAAAAN...actually the whole picture