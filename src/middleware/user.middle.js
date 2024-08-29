import { User } from "../module/user.model.js";
import Apierr from "../utiles/apierr.js";
import { promisecontrole } from "../utiles/promise.js";
import jwt from "jsonwebtoken"

export const varifyjwt = promisecontrole(async (req, res, next) => {
    try {
        const access = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer: ", "")

        if (!access) {
            throw new Apierr(404, "unauthorized request")
        }

        const decodedtoken = jwt.verify(access, process.env.ACCESS_TOKEN_SECRET)

        if (!decodedtoken) {
            throw new Apierr(404, "something went wrong on ACCESS_TOKEN ")
        }

        const client = await User.findById(decodedtoken?._id).select("-password -refreshtokan")
        if (!client) {
            throw new Apierr(404, "invalid ACCESS_TOKEN")
        }

        req.client = client
        next()
    } catch (error) {
        throw new Apierr(404, "something went wrong while varifying varifyjwt", error)
    }
})