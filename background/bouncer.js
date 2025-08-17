export const handleViewYouTubeVideo = () => {
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
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

    const { watchLaterVideos = [] } = await chrome.storage.local.get(
      "watchLaterVideos"
    );
    console.log("result", watchLaterVideos);
    if (!watchLaterVideos.length) {
      chrome.tabs.update(tabId, { url: "https://www.youtube.com/" });
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0];
    const watchLaterVideo = watchLaterVideos.find((x) => x.videoId === videoId);
    if (
      !watchLaterVideo ||
      watchLaterVideo.seenInWatchLaterDate === currentDate
    ) {
      chrome.tabs.update(tabId, { url: "https://www.youtube.com/" });
    }
  });
};
