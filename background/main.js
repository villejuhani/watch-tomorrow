import { restrictViewingYouTubeVideos } from "./bouncer.js";
import { handleAddVideoToWatchLaterPlaylist } from "./watch_later_storage.js";

restrictViewingYouTubeVideos();
handleAddVideoToWatchLaterPlaylist();
