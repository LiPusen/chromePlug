chrome.browserAction.onClicked.addListener(function (a) {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendRequest(tab.id, {event: "open"}, function (response) {
        });
    });
});