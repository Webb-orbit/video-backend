import { model, Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const Userschema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        logo: {
            type: String,
            required: true,
        },
        banner: {
            type: String,
        },
        watchistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        refreshtokan: {
            type: String,
        }
    }, { timestamps: true }
)

Userschema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 15)
    next()
})

Userschema.methods.ispasswordcorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

Userschema.methods.generateAccesstoken = function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

Userschema.methods.generateRefreshtoken = function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFERISH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFERISH_TOKEN_EXPIRY
        }
    )
}

export const User = model("User", Userschema)