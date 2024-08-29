import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../module/tweets.model.js";
import Apierr from "../utiles/apierr.js";
import Apiresponse from "../utiles/apires.js";
import { promisecontrole } from "../utiles/promise.js";

const addtweet = promisecontrole(async (req, res) => {
    const { content } = req.body
    if (!content) {
        throw new Apierr(400, "tweet content is required")
    }

    const createt = await Tweet.create({
        towner: req.client._id,
        content
    })

    if (!createt) {
        throw new Apierr(500, "some thing went wrong while createing tweet")
    }

    return res.status(200)
        .json(new Apiresponse(200, createt, "tweet created"))
})


const getusertweets = promisecontrole(async (req, res) => {
    const { creatorid } = req.params

    if (!creatorid) {
        throw new Apierr(400, "tweet id required")
    }
    if (!isValidObjectId(creatorid)) {
        throw new Apierr(400, "creatator id is invalid")
    }

    const tweets = await Tweet.find({
        towner: creatorid
    })

    if (!tweets?.length) {
        throw new Apierr(400, "no tweets found")
    }

    res.status(200)
        .json(new Apiresponse(200, tweets, "fectch tweets"))
})

const updatetweet = promisecontrole(async (req, res) => {
    const { tweetid } = req.params
    const { newcontent } = req.body
    if (!newcontent || !tweetid) {
        throw new Apierr(400, "newcontent and tweetid are required to update tweet")
    }

    const userstweet = await Tweet.find({
        towner: req.client._id,
        _id: tweetid
    })

    console.log(userstweet);

    if (!userstweet?.length) {
        throw new Apierr(400, "tweet not found")
    }

    const updatetweet = await Tweet.findByIdAndUpdate(
        tweetid,
        {
            content: newcontent
        }, { new: true }
    )

    if (!updatetweet) {
        throw new Apierr(500, "tweet not update server error")
    }

    res.status(200)
        .json(new Apiresponse(200, updatetweet, "tweet updated"))

})

const deleteusertweet = promisecontrole(async (req, res) => {
    const { tweetid } = req.params
    if (!tweetid) {
        throw new Apierr(400, "tweetid are required to delete tweet")
    }
    const userstweet = await Tweet.aggregate([
        {
            $match: {
                towner: req.client._id,
                _id: tweetid
            }
        }
    ])

    console.log(userstweet);

    if (!userstweet) {
        throw new Apierr(400, "tweet not found")
    }

    const deletetweet = await Tweet.findByIdAndDelete(tweetid)

    if (!deletetweet) {
        throw new Apierr(500, "tweet not deleted server error")
    }

    res.status(200)
        .json(new Apiresponse(200, {}, "tweet deleted successfully"))
})

const getonetweet = promisecontrole(async (req, res) => {
    const { tweetid } = req.params

    if (!isValidObjectId(tweetid)) {
        throw new Apierr(200, "invaild tweet id")
    }

    res.status(200)
        .json(new Apiresponse(200, "oneis", "testing.."))

})

export { addtweet, getusertweets, updatetweet, deleteusertweet, getonetweet }