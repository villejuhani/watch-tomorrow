const filterVideoIdsAlreadyInStorage = (watchLaterPageVideoIds, storedVideos) => {
  const storedIds = storedVideos.map((video) => video.videoId);
  return watchLaterPageVideoIds.filter((id) => !storedIds.includes(id));
};

const saveVideosToStorage = async (newVideoIds, syncedVideos = []) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const newEntries = newVideoIds.map((videoId) => ({
    videoId,
    seenInWatchLaterDate: currentDate,
  }));

  await chrome.storage.local.set({
    watchLaterVideos: [...syncedVideos, ...newEntries],
  });
};

const syncWatchLaterStorage = async (watchLaterPageVideoIds) => {
  const result = await chrome.storage.local.get("watchLaterVideos");
  const storedVideos = result.watchLaterVideos || [];

  // Remove videos not in Watch Later playlist
  const syncedVideos = storedVideos.filter((video) =>
    watchLaterPageVideoIds.includes(video.videoId)
  );
  if (!syncedVideos.length) {
    await saveVideosToStorage(watchLaterPageVideoIds);
    return;
  }

  const newVideoIds = filterVideoIdsAlreadyInStorage(
    watchLaterPageVideoIds,
    syncedVideos
  );
  await saveVideosToStorage(newVideoIds, syncedVideos);
};
