import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";



const addComment = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    const userId = req.user?._id
    const {comment} = req.body

    if(!videoId){
        throw new apiError(401,"Video ID required")
    }
    if(!comment){
        throw new apiError(401,"Comment is required")
    }
    
    const addedComment = await Comment.create({
        comment,
        video:videoId,
        owner:userId
    })

    return res
    .status(200)
    .json(new ApiResponse(200, addComment, "Comment added successfully"))

})
const getAllComments = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    if(!videoId){
        throw new apiError(401,"Video ID required")
    }

    const video = await Video.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId( videoId )
            }
        },
        {
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignField:"video",
                as:"comments",
                pipeline:[
                    {
                       $lookup:{
                          from:"users",
                          localField:"owner",
                          foreignField:"_id",
                          as:"owner",
                          pipeline:[
                            {
                                $project:{
                                    fullname:1,
                                    username:1,
                                    avatar:1
                                }
                            },
                          ]
            }
        },
        
        {
            $addFields:{
                owner:{
                    $first: "$owner"
                }
            }
        },
        
    ]
} 
        }  
    ])
    if(!video){
        throw new apiError(401,"Comments not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,video[0].comments,"Comment fetched successfully"))
})
const deleteComment = asyncHandler(async(req, res)=>{
    const {commentId} = req.params
    const userId = req.user?._id
    if(!commentId){
        throw new apiError(401,"Comments Id required")
    }
    const result = await Comment.findOneAndDelete({_id: commentId, owner:userId},{new: true})

    if(!result){
        throw new apiError(401,"Error while deleting comment")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, result, "Comment deleted successfully"))
})

const updateComment = asyncHandler(async(req, res)=>{
    const {commentId} = req.params
    const {comment} = req.body
    const userId = req.user?._id


    if(!commentId || !comment){
        throw new apiError(401,"Comment or comment ID is required")
    }
    const updatedComment = await Comment.findOneAndUpdate(
       {
        _id:commentId,
        owner:userId
       },
        {
            $set:{
                comment
            }
        },
        {new:true}
    )

    if(!updatedComment){
        throw new apiError(401,"Error while updating comment")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, updatedComment,"Comment updated successfully"))
})




export {
    addComment,
    getAllComments,
    deleteComment,
    updateComment
}