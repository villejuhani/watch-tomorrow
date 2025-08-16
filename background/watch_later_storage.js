export const handleAddVideoToWatchLaterPlaylist = () => {
  chrome.webRequest.onBeforeRequest.addListener(
    async (details) => {
      if (!details.url.includes("browse/edit_playlist")) {
        return;
      }

      const body = details.requestBody?.raw?.[0]?.bytes;
      if (!body) {
        return;
      }

      try {
        const text = new TextDecoder("utf-8").decode(body);
        const json = JSON.parse(text);
        if (!json.playlistId || json.playlistId !== "WL") {
          return;
        }

        const action = json?.actions?.[0];
        const videoId = action.addedVideoId;
        if (!videoId) {
          return;
        }

        const { watchLaterVideos = [] } = await chrome.storage.local.get(
          "watchLaterVideos"
        );
        if (watchLaterVideos.some((x) => x.videoId === videoId)) {
          return;
        }

        const currentDate = new Date().toISOString().split("T")[0];
        await chrome.storage.local.set({
          watchLaterVideos: [
            ...watchLaterVideos,
            { videoId, seenInWatchLaterDate: currentDate },
          ],
        });
      } catch (err) {
        console.error("Failed to parse request body", err);
      }
    },
    { urls: ["*://www.youtube.com/youtubei/*/browse/edit_playlist*"] },
    ["requestBody"]
  );
};
