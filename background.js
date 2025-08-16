// ----- handle navigation to Watch Later playlist -----
const sendMessageIfWatchLaterWasOpened = (tabId, url) => {
  if (url.includes("playlist?list=WL")) {
    chrome.tabs.sendMessage(tabId, { type: "WATCH_LATER_OPENED" });
  }
};

chrome.webNavigation.onCompleted.addListener(
  async (details) => {
    sendMessageIfWatchLaterWasOpened(details.tabId, details.url);
  },
  { url: [{ hostContains: "youtube.com" }] }
);

chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    sendMessageIfWatchLaterWasOpened(details.tabId, details.url);
  },
  { url: [{ hostContains: "youtube.com" }] }
);

// ----- block watching YouTube videos -----
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url) {
    return;
  }

  const url = new URL(changeInfo.url);
  if (url.hostname !== "www.youtube.com") {
    return;
  }

  if (url.pathname.startsWith("/shorts")) {
    chrome.tabs.update(tabId, { url: "https://www.youtube.com/" });
    return;
  }

  if (url.pathname !== "/watch") {
    return;
  }

  const videoId = url.searchParams.get("v");
  if (!videoId) {
    return;
  }

  chrome.storage.local
    .get(["watchLaterVideos"])
    .then(({ watchLaterVideos = [] }) => {
      console.log("result", watchLaterVideos);
      if (!watchLaterVideos.length) {
        chrome.tabs.update(tabId, { url: "https://www.youtube.com/" });
        return;
      }

      const currentDate = new Date().toISOString().split("T")[0];
      const watchLaterVideo = watchLaterVideos.find(
        (x) => x.videoId === videoId
      );
      if (
        !watchLaterVideo ||
        watchLaterVideo.seenInWatchLaterDate === currentDate
      ) {
        chrome.tabs.update(tabId, { url: "https://www.youtube.com/" });
      }
    });
});
