import { Playlist } from "../models/playlist.model.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user?._id;

  if (!name || !description) {
    throw new apiError(400, "Name or description required");
  }
  const playlist = await Playlist.create({
    name,
    description,
    owner: userId,
  });
  if (!playlist) {
    throw new apiError(500, "Error while creating playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});
const addVideoPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user?._id;

  if (!playlistId || !videoId) {
    throw new apiError(400, "Playlist or video id is required");
  }
  const playlist = await Playlist.findOne({ _id: playlistId, owner: userId });

  if (!playlist) {
    throw new apiError(500, "playlist not available");
  }
  playlist.videos.push(videoId);
  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added successfully"));
});

const getPlayListById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user?._id;

  if (!playlistId) {
    throw new apiError(400, "Playlist required");
  }
  const playlist = await Playlist.findOne({ _id: playlistId, owner: userId });
  if (!playlist) {
    throw new apiError(500, "Error while fetching playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user?._id;
  if (!playlistId || !videoId) {
    throw new apiError(400, "Playlist or video is required");
  }

  const playlist = await Playlist.findOne({ _id: playlistId, owner: userId });
  if(!playlist){
    throw new apiError(500,"Playlist not found")
  }
  const videoIndex = playlist.videos?.findIndex((video) => video.toString() === videoId.toString());



  
  if (videoIndex === -1) {
    throw new apiError(500, "Video not found in playlist");
  }
  playlist.videos.splice(videoIndex, 1);
  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video deleted successfully"));
});
const deletePlaylist = asyncHandler(async(req, res)=>{
    const {playlistId} = req.params
    const userId = req.user?._id
    if(!playlistId){
        throw new apiError(400,"Playlist id required")
    }

    await Playlist.findOneAndDelete({_id:playlistId, owner:userId})
    return res.status(200).json(new ApiResponse(200,{},"playlist deleted successfully"))

})
const getVideosFromPlaylist = asyncHandler(async(req, res)=>{
    const {playlistId} = req.params
    const userId = req.user?._id
    if(!playlistId){
        throw new apiError(400,"Playlist id is required")
    }
    const playlist = await Playlist.findOne({_id:playlistId, owner:userId}).populate("videos")
    if(!playlist){
        throw new apiError(500,"Playlist not available")
    }
    return res.status(200).json(new ApiResponse(200,playlist.videos,"Videos fetched successfully"))
})

export {
  createPlaylist,
  addVideoPlaylist,
  getPlayListById,
  removeVideoFromPlaylist,
  deletePlaylist,
  getVideosFromPlaylist
};
