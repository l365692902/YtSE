function c4rSearch() {
    console.log("HELLO");
    browser.notifications.create({
      "type": "basic",
      "title": "Hey boy",
      "message": "Have I got you attention ;)"
  });
}

browser.browserAction.onClicked.addListener(c4rSearch);