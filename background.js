(function() {
  'use strict';

  chrome.runtime.onConnect.addListener(function(port) {
    var requestData;

    port.onMessage.addListener(function(message) {
      console.log(message);
      if (port.name == "new tab") {
        requestData = message;
      }
    });

    if (port.name == "new tab") {
      console.log("New tab");
      chrome.tabs.create({'url': 'page/request_sending_page.html'}, function(tab) {
        var newTabId = tab.id;
        chrome.tabs.onUpdated.addListener(function onComplete(tabId, info, tab) {
            if (tabId == newTabId && info.status == "complete") {
                chrome.tabs.onUpdated.removeListener(onComplete);
                chrome.tabs.sendMessage(tabId, requestData);
            }
        });
      });
    }

  });

})();
