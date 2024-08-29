import { promisecontrole } from "../utiles/promise.js";
import { Comment } from "../module/comments.model.js";
import Apierr from "../utiles/apierr.js";
import { isValidObjectId } from "mongoose";
import Apiresponse from "../utiles/apires.js";

const addcomment = promisecontrole(async (req, res) => {
    const { content } = req.body
    const { videoid } = req.params
    if (!content) {
        throw new Apierr(400, "content is reqired")
    }
    if (!isValidObjectId(videoid)) {
        throw new Apierr(400, "invaild video id")
    }

    const rescomment = await Comment.create({
        content: content,
        owner: req.client._id,
        videois: videoid
    })

    if (!rescomment) {
        throw new Apierr(500, "server error on add comment")
    }

    res.status(200)
        .json(new Apiresponse(200, { rescomment }, "comment added"))

})


const updatecomment = promisecontrole(async (req, res) => {
    const { newcontent } = req.body
    const { commentid } = req.params
    if (!newcontent) {
        throw new Apierr(400, "newcontent is reqired")
    }
    if (!isValidObjectId(commentid)) {
        throw new Apierr(400, "invaild video id")
    }

    const updateedc = await Comment.findByIdAndUpdate(commentid, {
        content: newcontent
    }, { new: true })

    if (!updateedc) {
        throw new Apierr(500, "server error white updateing comment")
    }

    res.status(200)
        .json(new Apiresponse(200, { updateedc }, "TN you are so cringe yrr"))

})

const deletecomment = promisecontrole(async (req, res) => {
    const { videoid } = req.params
    if (!isValidObjectId(videoid)) {
        throw new Apierr(400, "invaild video id")
    }

    const deletecomment = await Comment.findByIdAndDelete(videoid, { new: true })

    if (!deletecomment) {
        throw new Apierr(500, "server error white deleting comment")
    }

    res.status(200)
        .json(new Apiresponse(200, {}, "TN you so good for me!"))
})

const getcomments = promisecontrole(async (req, res) => {
    const { videoid } = req.params
    const { page = 1, limit = 10 } = req.body

    if (!isValidObjectId(videoid)) {
        throw new Apierr(400, "invalid video id")
    }

    const totalcomments = await Comment.countDocuments({ videois: videoid })


    if (!totalcomments) {
        throw new Apierr(400, "comments not found on this video")
    }

    const totalpage = Math.ceil(totalcomments / limit)
    const skip = (page - 1) * totalpage

    const commentsare = await Comment.find({ videois: videoid }).skip(skip).limit(limit)

    if (!commentsare) {
        throw new Apierr(400, "comments not found 2")
    }

    res.status(200)
        .json(new Apiresponse(200, { commentsare }, "my mistake"))

})

const mycomments = promisecontrole(async(req, res)=>{
    const mycomment = await Comment.aggregate([
        {
            $match:{
                owner: req.client._id
            }
        }
    ])

    res.status(200)
    .json(new Apiresponse(200, {mycomment, total:mycomment.length}, "i work vary heard promise TN"))
    
})

export { addcomment, updatecomment, deletecomment, getcomments, mycomments }