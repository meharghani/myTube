import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";



const UserSubscription = asyncHandler(async(req,res) =>{
    const userId = req.user?._id
    const { channelName } = req.params

    const userChannel = await User.findOne({username: channelName}).select("-password -refreshToken")
   
    

    if( !userId && !userChannel){
        throw new apiError(400, "User or channel required")
    }
    const alreadySubscribed = await Subscription.findOne({
        $and:[{channel:userChannel?._id},{subscriber: userId}]
    })
    

    if(alreadySubscribed?.subscriber?.toString() === userId?.toString()){
        throw new apiError(401, "Already subscribed")
    }
    const subscribed = await Subscription.create({
        subscriber: userId,
        channel: userChannel._id
    })
    if(!subscribed){
        throw new apiError(400,"Subscription failed")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, subscribed, "Channel subscription successfully"))
})


export {
    UserSubscription
}