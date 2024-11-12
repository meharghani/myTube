import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";

const toggleLike = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const userId = req.user?._id;

  let resource;
  let query = { likedBy: userId };

  switch (type) {
    case "video":
      resource = await Video.findById(id);
      query.video = id;
      break;
    case "comment":
      resource = await Comment.findById(id);
      query.comment = id;
      break;
    case "tweet":
      resource = await Tweet.findById(id);
      query.tweet = id;
      break;
    default:
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid resource type"));
  }

  if (!resource) {
    return res.status(404).json(new ApiResponse(404, {}, `${type} not found`));
  }
  // check for existing like
  const existingLike = await Like.findOne(query);

  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "like removed successfully"));
  }
  //create new like entry
  const like = new Like(query);
  await like.save();
  if (!like) {
    throw new apiError(500, "Server error");
  }

  return res.status(200).json(new ApiResponse(200, like, "Liked successfully"));
});
const getLikedVideo = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const likedVideos = await Like.find({likedBy:userId}).populate('video')
  if(!likedVideos.length){
    return res.status(500).json(new ApiResponse(500,{},"You don not have liked videos"))
  }
 const videos = likedVideos.map((like)=>like.video)
  return res
    .status(200)
    .json(new ApiResponse(200,videos, "Successfully get liked videos"));
});

export { toggleLike, getLikedVideo };
