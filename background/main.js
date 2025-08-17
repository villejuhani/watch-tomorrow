import { handleViewYouTubeVideo } from "./bouncer.js";
import { handleAddToWatchLater } from "./add_video_handler.js";
import { handleFullPageReload, handleHistoryStateUpdate } from "./navigation_handler.js";

handleViewYouTubeVideo();
handleAddToWatchLater();
handleFullPageReload();
handleHistoryStateUpdate();