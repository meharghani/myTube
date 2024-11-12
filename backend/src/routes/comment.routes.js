import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getAllComments, updateComment } from "../controllers/comment.controller.js";




const router = Router()


router.route("/:videoId").post(verifyJWT,addComment).get(getAllComments)
router.route("/:commentId").delete(verifyJWT,deleteComment).patch(verifyJWT, updateComment)



export default router