const notifyWatchLaterOpened = (tabId, url) => {
  if (url.includes("playlist?list=WL")) {
    chrome.tabs.sendMessage(tabId, { type: "WATCH_LATER_OPENED" });
  }
};

export const handleFullPageReload = () => {
  chrome.webNavigation.onCompleted.addListener(
    async (details) => {
      notifyWatchLaterOpened(details.tabId, details.url);
    },
    { url: [{ hostContains: "youtube.com" }] }
  );
};

export const handleHistoryStateUpdate = () => {
  chrome.webNavigation.onHistoryStateUpdated.addListener(
    (details) => {
      notifyWatchLaterOpened(details.tabId, details.url);
    },
    { url: [{ hostContains: "youtube.com" }] }
  );
};
