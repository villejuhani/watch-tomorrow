const filterVideoIdsAlreadyInStorage = (videoIds, videosInStorage) => {
  const videoIdsInStorage = videosInStorage.map((video) => video.videoId);
  return videoIds.filter((id) => !videoIdsInStorage.includes(id));
};

const addNewVideosToStorage = async (newVideoIds, videosInStorage = []) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const newEntries = newVideoIds.map((videoId) => ({
    videoId,
    seenInWatchLaterDate: currentDate,
  }));

  await chrome.storage.local.set({
    watchLaterVideos: [...videosInStorage, ...newEntries],
  });
};

const addVideosToWatchLaterStorage = async (videoIds) => {
  const result = await chrome.storage.local.get("watchLaterVideos");
  const videosInStorage = result.watchLaterVideos || [];
  if (!videosInStorage.length) {
    await addNewVideosToStorage(videoIds);
    return;
  }

  const newVideoIds = filterVideoIdsAlreadyInStorage(
    videoIds,
    videosInStorage
  );
  await addNewVideosToStorage(newVideoIds, videosInStorage);
};
