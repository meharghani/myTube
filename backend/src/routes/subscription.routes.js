import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { UserSubscription } from "../controllers/subscription.controller.js";

const router = Router()


router.route("/channel-subscription/:channelName").post(verifyJWT, UserSubscription)


export default router