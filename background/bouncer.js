export const handleViewYouTubeVideo = () => {
  const TOAST_MESSAGES = {
    shortsBlocked: "The extension blocks watching shorts.",
    videoBlocked:
      "The extension blocked viewing the video. Add the video to your watch later playlist and watch it tomorrow or later",
  };

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
      showToast(TOAST_MESSAGES.shortsBlocked);
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
    if (!watchLaterVideos.length) {
      chrome.tabs.update(tabId, { url: "https://www.youtube.com/" });
      showToast(TOAST_MESSAGES.videoBlocked);
      return;
    }

    const currentDate = new Date().toLocaleDateString();
    const watchLaterVideo = watchLaterVideos.find((x) => x.videoId === videoId);
    if (
      !watchLaterVideo ||
      watchLaterVideo.seenInWatchLaterDate === currentDate
    ) {
      chrome.tabs.update(tabId, { url: "https://www.youtube.com/" });
      showToast(TOAST_MESSAGES.videoBlocked);
    }
  });
};

const showToast = (message) => {
  chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL("icons/watch_tomorrow.png"),
    title: "Watch Tomorrow",
    message: message,
  });
};
