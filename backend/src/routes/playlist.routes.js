import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlayListById,
  getVideosFromPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/").post(verifyJWT, createPlaylist);
router.route("/:playlistId").get(verifyJWT, getPlayListById);
router
  .route("/add-video/:playlistId/:videoId")
  .post(verifyJWT, addVideoPlaylist);
router
  .route("/remove-video/:playlistId/:videoId")
  .delete(verifyJWT, removeVideoFromPlaylist);
router.route("/delete-playlist/:playlistId").delete(verifyJWT, deletePlaylist);
router.route("/get-videos/:playlistId").get(verifyJWT,getVideosFromPlaylist)

export default router;
