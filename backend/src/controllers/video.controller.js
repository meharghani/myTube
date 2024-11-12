import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { apiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import {deleteImageFromCloudinary, deleteVideoFromCloudinary, updateFileOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"


const publishVideo = asyncHandler(async(req, res)=>{
    //get video details from user
    const {title, description} = req.body
    const userId = req.user?._id 
    const vidoePath = req.files?.videoFile[0]?.path
    const thumbnailPath = req.files?.thumbnail[0]?.path
    if(
        [title,description,vidoePath,thumbnailPath].some((field)=> field === "")
       ){
        throw new apiError(400, "All fields are required")
       }
       const videoFile = await uploadOnCloudinary(vidoePath)
       const thumbnail = await uploadOnCloudinary(thumbnailPath)



       if(!videoFile && !thumbnail){
        throw new apiError(500, "Data not recieving from cloudinary")
       }
       
       
       const video = await Video.create({
        title,
        description,
        videoFile:videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        thumbnailPublicId:thumbnail.public_id,
        owner:userId,
        videoPublicId:videoFile.public_id
       })
       return res
       .status(200)
       .json(new ApiResponse(200,video, "Video uploaded successfully"))

})

const getAllVidoes = asyncHandler(async(req, res)=>{
    const {page=1, limit=10, query='', sortBy='createdAt', sortType="desc", userId} = req.query
   
    let fillter = {}

    if(userId){
        fillter.owner = new mongoose.Types.ObjectId(userId)
    }
    if(query){
        
        
        fillter.$or = [
            {title: {$regex: query, $options:"i"}},
            {description: {$regex:query, $options:"i"}}
        ]
    }
    const sortOptions = {}
    sortOptions[sortBy] = sortType === 'asc' ? 1 : -1


    const vidoes = await Video.find(fillter)
    .sort(sortOptions)
    .skip((page-1) * limit)
    .limit(parseInt(limit))

    const totalVideos = await Video.countDocuments(fillter)

    return res
    .status(200)
    .json(new ApiResponse(200, {
        vidoes,
         total:totalVideos,
          page: parseInt(page), 
          limit: parseInt(limit),
          totalPage: Math.ceil(totalVideos/limit)
        }, "All videos feteched successfully"))
})
const getVideoById = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    
    
    if(!videoId){
        throw new apiError(401,"Please provide vidoe ID")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new apiError(400, "Video fetching failed")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,video,"Vidoe fetched successfully"))
})
const updateVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const userId = req.user?._id
    const {title, description} = req.body
    const thumbnailPath = req.file?.path


    if(!title && !description){
        throw new apiError(401,"Title or description required")
    }
 
    if(!videoId){
        throw new apiError(401,"Video ID is required")
    }
    if(!userId){
        throw new apiError(401,"User validation failed")
    }
    const video = await Video.findOne({_id:videoId, owner:userId})

    
    if(!video){
        throw new apiError(401,"Vidoe is not available")
    }
    let updatedThumbnail
    if(thumbnailPath){
        updatedThumbnail = await updateFileOnCloudinary(video?.thumbnailPublicId,thumbnailPath)
        
       
        
        if(!updatedThumbnail){
            throw new apiError(401,"Unable to get updated thumbnail")
        }
    }
    const updatedVideo = await Video.findByIdAndUpdate(
        video._id,
        {
            $set:{
                title,
                description,
                thumbnail:updatedThumbnail?.url 
            }
        },
        {
            new: true
        }
    )
    if(!updatedVideo){
        throw new apiError(401,"Video updation failed")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated sucessfully"))
})
const deleteVideo = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    const userId = req.user?._id

    if(!videoId){
        throw new apiError(401, "Video ID required")
    }
    const video = await Video.findOne({_id:videoId,owner:userId})
    if(!video){
        throw new apiError(401, "Video not found")
    }
    await deleteVideoFromCloudinary(video.videoPublicId)
    await deleteImageFromCloudinary(video.thumbnailPublicId)

    const result  = await Video.findOneAndDelete(video._id)

    if(!result){
        throw new apiError(401,"Error while deleting video")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, result, "Video deleted successfullt"))




})
const toggleIsPublished = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    const userId = req.user?._id

    if(!videoId){
        throw new apiError(401,"Video ID required")
    }

    const video = await Video.findOne({_id:videoId,owner:userId})
    if(!video){
        throw new apiError(401, "Video not found")
    }
    video.isPublished = !video.isPublished
    await video.save()
    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video isPublished toggle successfully"))
})

export{
    publishVideo,
    getAllVidoes,
    getVideoById,
    updateVideo,
    deleteVideo,
    toggleIsPublished
}