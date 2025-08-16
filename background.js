chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url) {
    return;
  }

  const url = new URL(changeInfo.url);
  const isYoutube = url.hostname === "www.youtube.com";
  if (!isYoutube){
    return;
  }

  if (url.pathname.startsWith("/shorts")) {
    chrome.tabs.update(tabId, { url: "https://www.youtube.com/" });
  }
  
  if (!url.pathname === "/watch") {
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
        return;
      }

      const currentDate = new Date().toISOString().split("T")[0];
      const watchLaterVideo = watchLaterVideos.find(
        (x) => x.videoId === videoId
      );
      if (!watchLaterVideo || watchLaterVideo.seenInWatchLaterDate === currentDate) {
        chrome.tabs.update(tabId, { url: "https://www.youtube.com/" });
      }
    });
});
