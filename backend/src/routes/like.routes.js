import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getLikedVideo, toggleLike } from "../controllers/like.controller.js"


const router = Router()


router.route("/:type/:id").post(verifyJWT,toggleLike)
router.route("/videos").get(verifyJWT, getLikedVideo)

export default router