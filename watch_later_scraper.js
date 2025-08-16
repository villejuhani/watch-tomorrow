const waitForElement = (selector, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let elapsed = 0;

    const check = () => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);

      elapsed += interval;
      if (elapsed >= timeout)
        return reject(new Error(`Timeout waiting for: ${selector}`));
      setTimeout(check, interval);
    };

    check();
  });
};

const scrapeWatchLater = async () => {
  try {
    await waitForElement("ytd-playlist-video-renderer a#video-title");
    const videoIds = Array.from(
      document.querySelectorAll("ytd-playlist-video-renderer a#video-title")
    )
      .map((a) => {
        try {
          return new URL(a.href).searchParams.get("v");
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return videoIds;
  } catch (err) {
    console.error("Failed to find Watch Later videos:", err);
  }
};

const handleWatchLaterOpened = async () => {
  const videoIds = await scrapeWatchLater();
  if (!videoIds || !videoIds.length) {
    return;
  }

  await syncWatchLaterStorage(videoIds);
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "WATCH_LATER_OPENED") {
    handleWatchLaterOpened();
  }
});
