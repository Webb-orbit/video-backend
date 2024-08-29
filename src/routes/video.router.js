import { Router } from "express";
import { varifyjwt } from "../middleware/user.middle.js";
import { uploadfile } from "../middleware/uploadfile.js";
import { deletevideo, getallvideos, getonevideo, updatecover, updatevideo, uploadvideo } from "../controllers/video.control.js";

const router = Router()

router.route("/").get(varifyjwt, getallvideos)
router.route("/:videoid").get(varifyjwt, getonevideo)
router.route("/upload-video").post(varifyjwt, uploadfile.fields([{name: 'video'}, {name: 'cover'}]), uploadvideo)
router.route("/updatecover/:videoid").patch(varifyjwt, uploadfile.single('coverpath'), updatecover)
router.route("/update-video/:videoid").patch(varifyjwt, updatevideo)
router.route("/delete/:videoid").get(varifyjwt, deletevideo)

export default router
