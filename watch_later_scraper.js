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
  if (!window.location.href.includes("playlist?list=WL")) {
    return;
  }

  const videoIds = await scrapeWatchLater();
  if (!videoIds || !videoIds.length) {
    return;
  }

  await syncWatchLaterStorage(videoIds);
};

// Observe URL changes via YouTube's SPA behavior
let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    handleWatchLaterOpened();
  }
}).observe(document, { subtree: true, childList: true });

// Run initially in case we landed directly to watch later page
handleWatchLaterOpened();
