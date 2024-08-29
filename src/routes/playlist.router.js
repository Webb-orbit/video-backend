import { Router } from "express";
import { varifyjwt } from "../middleware/user.middle.js";
import { addvideofromplaylist, createplaylist, deleteplaylist, getplaylist, getuserplaylist, removideoplaylist, updateplaylist } from "../controllers/playlist.control.js";

const router = Router()

router.use(varifyjwt)

router.route("/createnew").post(createplaylist)
router.route("/add/:playlistid/:videoid").patch(addvideofromplaylist)
router.route("/remove/:playlistid/:videoid").patch(removideoplaylist)
router.route("/update/:playlistid").patch(updateplaylist)
router.route("/delete/:playlistid").delete(deleteplaylist)
router.route("/get/:playlistid").get(getplaylist)
router.route("/userplaylists/:userid").get(getuserplaylist)

export default router