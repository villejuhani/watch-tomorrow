chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const url = new URL(changeInfo.url);

    if (
      url.hostname === "www.youtube.com" &&
      (url.pathname === "/watch" || url.pathname.startsWith("/shorts"))
    ) {
      chrome.tabs.update(tabId, { url: "https://www.youtube.com/" });
    }
  }
});