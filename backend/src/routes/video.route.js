import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVidoes, getVideoById, publishVideo, toggleIsPublished, updateVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()


router.route("/").post(
    verifyJWT,
    upload.fields([
        {
            name:"videoFile",
            maxCount: 1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    publishVideo).get(getAllVidoes)

router.route("/:videoId")
.get(getVideoById)
.patch(verifyJWT,upload.single("thumbnail"),updateVideo)
.delete(verifyJWT, deleteVideo)
router.route("/toggle-status/:videoId").patch(verifyJWT, toggleIsPublished)
export default router