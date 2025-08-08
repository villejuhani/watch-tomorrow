chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SET_ALLOWED_VIDEO_IDS") {
    chrome.storage.session.set(
      { allowedVideoIds: message.allowedVideoIds },
      () => {}
    );
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const url = new URL(changeInfo.url);

    if (
      url.hostname === "www.youtube.com" &&
      (url.pathname === "/watch" || url.pathname.startsWith("/shorts"))
    ) {
      const videoId = url.searchParams.get("v");
      console.log("video id", videoId);
      chrome.storage.session.get("allowedVideoIds", (result) => {
        const allowed = result.allowedVideoIds || [];
        console.log("allowed", allowed);
        if (!allowed.includes(videoId)) {
          chrome.tabs.update(tabId, { url: "https://www.youtube.com/" });
        }
      });
    }
  }
});
