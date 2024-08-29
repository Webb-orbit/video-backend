import { promisecontrole } from "../utiles/promise.js";
import Apierr from "../utiles/apierr.js";
import { Playlist } from "../module/playlist.model.js";
import Apiresponse from "../utiles/apires.js";
import { isValidObjectId } from "mongoose";

const createplaylist = promisecontrole(async(req, res)=>{
    const {name, description} = req.body
    if (!name) {
        throw new Apierr(400, "name or title is reqired")
    }

    const createdplaylist = await Playlist.create({
        name,
        description,
        owner: req.client._id
    })

    if (!createdplaylist) {
        throw new Apierr(500, "something went wrong while createing playlist")
    }

    res.status(200)
    .json(new Apiresponse(200, {createdplaylist}, "hello playlist is created"))
})

const addvideofromplaylist = promisecontrole(async(req, res)=>{
    const {playlistid, videoid} = req.params

    if ([playlistid, videoid].some((e)=>e.trim() === "")) {
        throw new Apierr(400, "playlistid and videoid are required")
    }
    if(!isValidObjectId(playlistid) || !isValidObjectId(videoid)){
        throw new Apierr(400, "playlistid or videoid are invalid")
    }

    const playlist = await Playlist.findById(playlistid)
    await playlist.videos.push(videoid)
    const final = await playlist.save({validateBeforeSave: false})

    if (!final) {
        throw new Apierr(500, "server error on adding video")
    }

    res.status(200)
    .json(new Apiresponse(200, {final}, "add new video on this playlist"))
})

//new

const removideoplaylist = promisecontrole(async(req, res)=>{
    const {playlistid, videoid} = req.params

    if (!isValidObjectId(playlistid) || !isValidObjectId(videoid)) {
        throw new Apierr(400, "ids are invalid")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistid,{
        $pull: {videos: videoid},
    },{new: true})

    if (!playlist) {
        throw new Apierr(500, "something ronge when removeing video")
    }

    res.status(200)
    .json(new Apiresponse(200, {playlist}, "video removed"))
})

const updateplaylist = promisecontrole(async(req, res)=>{
    const {playlistid} = req.params
    const {name, description} = req.body
    if (!isValidObjectId(playlistid)) {
        throw new Apierr(400, "videoid is required")
    }
    if (!name) {
        throw new Apierr(400, "name is required")
    }

    const updated = await Playlist.findByIdAndUpdate(playlistid,{
        name,
        description
    }, {new:true})

    if (!updated) {
        throw new Apierr(500, "server error can't update playlist")
    }

    res.status(200)
    .json(new Apiresponse(200, {updated},"playlist updated"))
})

const deleteplaylist = promisecontrole(async(req, res)=>{
    const {playlistid} = req.params
    if (!isValidObjectId(playlistid)) {
        throw new Apierr(400, "videoid is required")
    }
    const deletedplaylist = await Playlist.findByIdAndDelete(playlistid)

    if (!deletedplaylist) {
        throw new Apierr(500, "server error can't delete playlist")
    }

    res.status(200)
    .json(new Apiresponse(200, {},"playlist deleted"))
})

const getplaylist = promisecontrole(async(req, res)=>{
    const {playlistid} = req.params
    if (!isValidObjectId(playlistid)) {
        throw new Apierr(400, "videoid is required")
    }

    const findplaylist = await Playlist.findById(playlistid)
    if (!findplaylist) {
        throw new Apierr(500, "server error can't find playlist")
    }

    res.status(200)
    .json(new Apiresponse(200, {findplaylist},"enjoy playlist"))

})

const getuserplaylist = promisecontrole(async(req, res)=>{
    const {userid} = req.params
    if (!isValidObjectId(userid)) {
        throw new Apierr(400, "videoid and userid both are required")
    }

    const userplaylist = await Playlist.find({owner: userid})

    if (!userplaylist?.length) {
        throw new Apierr(500, "emty user playlist")
    }

    res.status(200)
    .json(new Apiresponse(200, {userplaylist, total:userplaylist?.length}, `${userplaylist?.length} playlist founded`))
})

export {createplaylist, addvideofromplaylist, removideoplaylist, updateplaylist, deleteplaylist, getplaylist, getuserplaylist}