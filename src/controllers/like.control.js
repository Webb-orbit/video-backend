import { isValidObjectId } from "mongoose";
import { promisecontrole } from "../utiles/promise.js";
import Apierr from "../utiles/apierr.js";
import { Like } from "../module/likes.model.js";
import Apiresponse from "../utiles/apires.js";
import { Video } from "../module/video.model.js";
import { Tweet } from "../module/tweets.model.js";
import { Comment } from "../module/comments.model.js";

const togglevideolike = promisecontrole(async (req, res) => {
    const { videoid } = req.params

    if (!isValidObjectId(videoid)) {
        throw new Apierr(400, "invalid video id")
    }

    const exested = await Video.findById(videoid)
    if (!exested) {
        throw new Apierr(404, "video not found")
    }

    const likedonvideo = await Like.findOne({
            $and: [
                {video: videoid},
                {likeby: req.client._id}
            ]
    })

    if (likedonvideo) {
        let deletedlike = await Like.deleteOne({
            $and: [
                {video: videoid},
                {likeby: req.client._id}
            ]
    })

    return res.status(200)
    .json(new Apiresponse(200, deletedlike._id, "like removed"))
    }else{
        let addlike = await Like.create({
            video: videoid,
            likeby: req.client._id
        })

        return res.status(200)
        .json(new Apiresponse(200, addlike._id, "like added"))
    }
})

const toggletweetlike = promisecontrole(async (req, res)=>{
    const {tweetid} = req.params
    if (!isValidObjectId(tweetid)) {
        throw new Apierr(400, "invalid tweet id")
    }

    const exested = await Tweet.findById(tweetid)
    if (!exested) {
        throw new Apierr(404, "tweet not found")
    }

    const tweetliked = await Like.findOne({
        $and:[
            {tweet: tweetid},
            {likeby: req.client._id}
        ]
    })

    if (tweetliked) {
        const removelike = await Like.deleteOne({
            $and:[
                {tweet: tweetid},
                {likeby: req.client._id}
            ]
        })
        if (removelike) {
            return res.status(200)
            .json(new Apiresponse(200, removelike, "like removed on tweet"))
        }
    } else {
        const addlike = await Like.create({
            tweet: tweetid,
            likeby: req.client._id
        })
        if (addlike) {
            return res.status(200)
            .json(new Apiresponse(200, addlike, "like added on tweet"))
        }
    }

    throw new Apierr(500, "something went wrong while prosses like on tweet")

})

const togglecommentlike = promisecontrole(async (req, res)=>{
    const {commentid} = req.params
    if (!isValidObjectId(commentid)) {
        throw new Apierr(400, "invalid comment id")
    }

    const exested = await Comment.findById(commentid)
    if (!exested) {
        throw new Apierr(404, "comment not found")
    }

    const commentliked = await Like.findOne({
        $and:[
            {comment: commentid},
            {likeby: req.client._id}
        ]
    })

    if (commentliked) {
        const removelike = await Like.deleteOne({
            $and:[
                {comment: commentid},
                {likeby: req.client._id}
            ]
        })
        if (removelike) {
            return res.status(200)
            .json(new Apiresponse(200, removelike, "like removed on comment"))
        }
        throw new Apierr(500, "something went wrong while prosses like on comment")
    } else {
        const addlike = await Like.create({
            comment: commentid,
            likeby: req.client._id
        })
        if (addlike) {
            return res.status(200)
            .json(new Apiresponse(200, addlike, "like added on comment"))
        }
        throw new Apierr(500, "something went wrong while prosses like on comment")
    }


})

const allikedvideo = promisecontrole(async (req, res)=>{
    const videos = await Like.aggregate([
        {
            $match:{
                likeby: req.client._id
            }
        }
    ])
    
    if (!videos?.length) {
        return res.status(200)
        .json(new Apiresponse(200, {videos, totle: videos.length}, "no like video found"))
    }

    return res.status(200)
        .json(new Apiresponse(200, {videos, totle: videos.length}, "like videos fetched successfully"))
})

export { togglevideolike, toggletweetlike, togglecommentlike, allikedvideo }