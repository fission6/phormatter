//In background.js:
// React when a browser action's icon is clicked.
chrome.browserAction.onClicked.addListener(function(tab) {
    var tool_page = chrome.extension.getURL('tool.html');
    chrome.tabs.create({url:tool_page});
});