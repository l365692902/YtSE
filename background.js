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
xmlHttp.onreadystatechange = () => {
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    popUpNotification("got web page " + xmlHttp.status + " " + xmlHttp.status + xmlHttp.responseText.length)
  }
}

browser.browserAction.onClicked.addListener(() => {
  xmlHttp.open("GET", "https://www.youtube.com/results?search_query=阅后即瞎", true)
  xmlHttp.send()
  popUpNotification("request has been sent...waiting for respond")
})


