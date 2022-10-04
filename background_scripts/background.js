chrome.runtime.onInstalled.addListener(() => {

  let server = {
	  info: "http://127.0.0.1:9080/domains",
	  subm: "127.0.0.1:9090/fileDi?alias=xx&domain=1.com"
  };
  chrome.storage.sync.set({ server });
  console.log('first installed');
});

function handleMessage(request, sender, sendResponse) {
 
  if (sender.url != chrome.runtime.getURL("/devtools/panel/panel.html")) {
    return;
  }

  chrome.tabs.executeScript(
    request.tabId, 
    {
      code: request.script
    });
  
}

/**
Listen for messages from our devtools panel.
*/
chrome.runtime.onMessage.addListener(handleMessage); 