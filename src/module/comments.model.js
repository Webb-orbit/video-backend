import { Schema, model } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"


const commentschema = new Schema({
    content: {
        type: String,
        required: true,
    },
    videois: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

commentschema.plugin(aggregatePaginate)

export const Comment = model("Comment", commentschema)