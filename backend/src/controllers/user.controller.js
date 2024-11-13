import asyncHandler from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import mongoose, { model } from "mongoose"



const generateAccessAndRefreshToken = async (userId)=>{
   try {
     const user = await User.findById(userId)
     const accessToken = await user.generateAccessToken()
     const refreshToken = await user.generateRefreshToken()


     user.refreshToken = refreshToken
    
     
     await user.save({validateBeforeSave: false})
     
     return {accessToken, refreshToken}
   } catch (error) {
      throw new apiError(500,"Something went wrong while generating access or refresh token")
   }
}

const registerUser = asyncHandler(async(req, res)=>{
   // get user detail from frontend
   const {fullname, username, email, password} = req.body

 
  // validation - not empty
  
   if(
    [fullname,email,username,password].some((field)=> field?.trim() === "")
   ){
    throw new apiError(400, "All fields are required")
   }
   // check if user already exists
   const existedUser = await User.findOne({
    $or: [{username},{email}]
   })
   if(existedUser){
    throw new apiError(409,"User already exist" )
   }
   // check for images and avatar
 
   
   const avatarLocalPath = req.files?.avatar[0]?.path
  // const coverImageLocalPath = req.files?.coverImage[0]?.path
   let coverImageLocalPath
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ){
      coverImageLocalPath = req.files.coverImage[0].path
   }
   if(!avatarLocalPath){
    throw new apiError(400, "Avatar is required")
   }
   // upload images to cloudinary
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)
   if(!avatar){
      throw new apiError(400,"Avatar file is required")
   }
   // create user object - create entry in db 
  const user = await User.create({
      fullname,
      avatar:avatar.url,
      username:username.toLowerCase(),
      email,
      coverImage: coverImage?.url || "",
      password

   })
   // remove passoerd and refresh token field from response
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )
   // check for user creation
   if(!createdUser){
      throw new apiError(500, "Error while creation user")
   }
   // return response
   res.status(201).json(
      new ApiResponse(200,createdUser, "User created successfully")
   )
})

const loginUser = asyncHandler(async(req, res)=>{
   // get data from user
   const {email, username, password} = req.body
   // username or email 
   if(!username && ! email){
      throw new apiError(400, "username or email required")
   }
   // find the user
   const user = await User.findOne({
      $or: [{username},{email}]
   })
   if(!user){
      throw new apiError(404, "User does not exist")
   }
   //password check
   const isPasswordValid = await user.isPasswordCorrect(password)
   if(!isPasswordValid){
      throw new apiError(401, "Invalid user credentials")
   }
   //access and refresh token 
   const {accessToken, refreshToken} =await generateAccessAndRefreshToken(user._id)

   
   
   //send cookie
  const loggedInUser = await User.findById(user._id).select(
   "-password -refreshToken"
  )
  const options = {
   httpOnly: true,
   secure: true
  }
  return res
  .status(200)
  .cookie("accessToken",accessToken, options)
  .cookie("refreshToken",refreshToken,options)
  .json(new ApiResponse(200,{user: loggedInUser, accessToken, refreshToken},"User logged in successfully"))
})

const logutUser = asyncHandler(async(req, res)=>{
  await User.findByIdAndUpdate(
      req.user._id,
      {
         $unset:{
            refreshToken: 1
         }
      },
      {
         new:true
      }
   )
   const options = {
      httpOnly: true,
      secure: true
     }
     return res
     .status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
  const incomingRefreshToken =  req.cookies.refreshToken
  if(!incomingRefreshToken){
   throw new apiError((401,"Unauthorized request"))
  }
  try {
   const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
   const user = await User.findById(decodedToken?._id)
   
   
   if(!user){
    throw new apiError(401, "Invalid refresh token")
   }
   if(incomingRefreshToken !== user?.refreshToken){
      throw new apiError(401, "Token used or expire")
   }
   const{accessToken, refreshToken}= await generateAccessAndRefreshToken(user?._id)
 
   const options = {
      httpOnly: true,
      secure: true
     }
   res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(new ApiResponse(200,
      {accessToken,refreshToken},
      "Access token refreshed successfully"
   ))
  } catch (error) {
   throw new apiError(401, "Error in refreshed token")
  }
})

const changeCurrentPassword = asyncHandler(async(req, res)=>{
   const {oldPassword, newPassword} = req.body
   const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect){
   throw new apiError(401,"Invalid old password")
  }
  user.password = newPassword
  await user.save({validateBeforeSave: false})
  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Password change successfully"))
})

const getCurrentUser = asyncHandler(async(req,res)=>{
   return res
         .status(200)
         .json(new ApiResponse(200, req.user,"Current user fetched successfully"))
})
const updateUserDetails = asyncHandler(async(req,res)=>{
   const {fullname, email} = req.body
   if(!(fullname || email)){
      throw new apiError(401, "User details is required")
   }
   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set:{
            fullname,
            email
         }
      },
      {
         new: true
      }
   ).select("-password -refreshToken")

   
   return res
   .status(200)
   .json(new ApiResponse(200, user, "User updated successfully"))
})

const updateUserAvatar = asyncHandler(async(req, res)=>{
  const avatarLocalPath =  req.file?.path
  if(!avatarLocalPath){
   throw new apiError(401, "Avatar file is missing")
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if(!avatar.url){
   throw new apiError(400, "Error while uploading avatar")
  }
  const user = await User.findByIdAndUpdate(
   req.user?._id,
   {
      $set:{
         avatar: avatar.url
      }
   },
   {new:true}
  ).select("-password -refreshToken")

  return res
  .status(200)
  .json(new ApiResponse(200, user,"Avatar updated successfully"))
})
const getUserChannelProfile = asyncHandler(async(req,res)=>{
   const {username} = req.params
  
   
   if(!username?.trim()){
      throw new apiError(400, "Username is missing")
   }
 const channel = await  User.aggregate([
      {
         $match:{
            username: username?.toLowerCase()
         }
      },
      {
         $lookup:{
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers"
         }
      },
      {
         $lookup:{
            from: "subscriptions",
            localField: "_id",
            foreignField:"subscriber",
            as: "subscribedTo"
         }
      },
      {
         $addFields:{
            subsribersCount:{
             $size: { "$ifNull": [ "$subscribers", [] ] }
            },
            channelsSubscribedToCount:{
               $size: { "$ifNull": [ "$subscribedTo", [] ] }
            },
            isSubscribed:{
               $cond:{
                  if:{$in: [req.user?._id, "$subscribers.subscriber"]},
                  then: true,
                  else: false
               }
            }
         }
      },
      {
         $project:{
            fullname: 1,
            username:1,
            subsribersCount: 1,
            channelsSubscribedToCount:1,
            isSubscribed:1,
            avatar: 1,
            coverImage: 1


         }
      }
   ])
   if(!channel?.length){
      throw new apiError(400, "Channel does not exist")
   }
   return res
   .status(200)
   .json(new ApiResponse(200, channel[0], "Get channel successfully"))

})
const addvideoToWatchHistory = asyncHandler(async(req, res)=>{
   const userId = req.user?._id
   const {videoId} = req.params
   const user = await User.findById(userId).select("-password -refreshToken")
   if(!user){
      throw new apiError(400,"User not found")
   }
   user.watchHistory.push(videoId)
   await user.save()
   return res
   .status(200)
   .json(new ApiResponse(200, user.watchHistory, "Video added to watch history"))
})
const getWatchHistory = asyncHandler(async(req, res)=>{
   const user = await User.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(req.user._id)
         }
      },
      {
         $lookup:{
            from:"videos",
            localField:"watchHistory",
            foreignField:"_id",
            as:"watchHistory",
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
                        }
                     ]
                  }
               },
               {
                  $addFields:{
                     owner:{
                        $first: "$owner"
                     }
                  }
               }
            ]
         }
      }
   ])
   return res
   .status(200)
   .json(new ApiResponse(200, user[0].watchHistory,"Watch history fectched successfully"))
})


export {
    registerUser,
    loginUser,
    logutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar,
    getUserChannelProfile,
    addvideoToWatchHistory,
    getWatchHistory
}