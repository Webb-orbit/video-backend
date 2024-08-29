import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../module/video.model.js";
import Apierr from "../utiles/apierr.js";
import Apiresponse from "../utiles/apires.js";
import { daleteoncloud, dvideooncloud, extractfileidFromUrl, uploadoncloud } from "../utiles/cloud.js";
import { promisecontrole } from "../utiles/promise.js";

const uploadvideo = promisecontrole(async (req, res) => {
    const { title, description } = req.body
    if (!title || !description) {
        throw new Apierr(401, "title and description are required")
    }

    const videopath = req.files?.video[0]?.path
    const coverpath = req.files?.cover[0]?.path
    if (!videopath || !coverpath) {
        throw new Apierr(401, "video and cover are required")
    }

    const uploadedvideo = await uploadoncloud(videopath)
    const uploadedcover = await uploadoncloud(coverpath)

    if (!uploadedvideo?.url || !uploadedcover?.url) {
        throw new Apierr(500, "error while uploading files on server")
    }

    const createvi = await Video.create({
        videofile: uploadedvideo?.url,
        thumnail: uploadedcover?.url,
        title,
        description,
        duration: uploadedvideo?.duration,
        owner: req.client._id,
    })
    console.log('createvi', createvi);

    if (!createvi) {
        throw new Apierr(500, "server error")
    }

    res.status(200)
        .json(new Apiresponse(200, { video: createvi }, "video uploaded successfully"))

})

const updatevideo = promisecontrole(async (req, res) => {
    const { title, description, ispublic } = req.body
    const { videoid } = req.params

    if ([title, description, ispublic].some((e) => e?.trim() === "")) {
        throw new Apierr(401, "title || description || ispublic one are required")
    }

    const updatevideo = await Video.findByIdAndUpdate(
        videoid,
        {
            $set: {
                title,
                description,
                ispublic,
            }
        }, { new: true }
    )

    res.status(200)
        .json(new Apiresponse(200, { video: updatevideo }, "update successfull"))
})

const updatecover = promisecontrole(async (req, res) => {
    const coverpath = req.file?.path
    const { videoid } = req.params

    if (!videoid) {
        throw new Apierr(401, "videoid is required to update thumnail")
    }
    if (!coverpath) {
        throw new Apierr(401, "cover is required to update thumnail")
    }

    const videois = await Video.findById(videoid)
    if (!videois) {
        throw new Apierr(404, "video not found")
    }

    const upcover = await uploadoncloud(coverpath)
    if (!upcover.url) {
        throw new Apierr(500, "failed to save on server")
    }

    const isdone = await Video.findByIdAndUpdate(
        videoid,
        {
            $set: {
                thumnail: upcover.url
            }
        }, { new: true }
    )

    if (!isdone) {
        throw new Apierr(500, "database earror")
    }

    const oldpublicid = extractfileidFromUrl(videois.thumnail)
    await daleteoncloud(oldpublicid)

    res.status(200)
        .json(new Apiresponse(200, { video: isdone }, "thumnail updated"))
})

const getonevideo = promisecontrole(async (req, res) => {
    const { videoid } = req.params
    console.log(`videoid: -> ${videoid}`);

    const vid = await Video.findByIdAndUpdate(
        videoid,
        {
            $inc: {
                views: 1
            }
        }, { new: true }
    )
    if (!vid) {
        throw new Apierr(500, "server error")
    }
    res.status(200)
        .json(new Apiresponse(200, { vid }, "video fetch succssfull and incrament views"))
})

const getallvideos = promisecontrole(async (req, res) => {
    const { page = 1, limit = 2, userId } = req.body

    if (!isValidObjectId(userId)) {
        throw new Apierr(404, "userid not found")
    }

    const totalVideos = await Video.countDocuments({ owner: userId })
    console.log(totalVideos);

    if (!totalVideos) {
        throw new Apierr(404, "video not found")
    }

    const totalPage = Math.ceil(totalVideos / limit)
    let skip = (page - 1) * limit

    const videos = await Video.find({ owner: userId })
        .skip(skip).limit(limit)

    return res
        .status(200)
        .json(new Apiresponse(200, { videos, totalPage }, "All videos fetched successfully!"))

})

const deletevideo = promisecontrole(async (req, res) => {
    const { videoid } = req.params

    if (!isValidObjectId(videoid)) {
        throw new Apierr(404, "invalid video id")
    }

    const deleteed = await Video.findByIdAndDelete(videoid)
    
    if (!deleteed) {
        throw new Apierr(500, "video not found or server error")
    }
    
    const videopublicid = extractfileidFromUrl(deleteed?.videofile)
    const thumnailpublicid = extractfileidFromUrl(deleteed?.thumnail)
    
    const deletevideo = await dvideooncloud(videopublicid)
    const deletethumnail = await daleteoncloud(thumnailpublicid)

    if (!deletevideo && !deletethumnail) {
        throw new Apierr(500, "something went wrong when deleting files in server")
    }

    res.status(200)
        .json(new Apiresponse(200, deleteed.title, "video deleted!!"))
})

export {
    uploadvideo,
    updatevideo,
    updatecover,
    getonevideo,
    getallvideos,
    deletevideo
}