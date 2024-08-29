import { model, Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"


const likeSchema = new Schema({
    video:{
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    tweet:{
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },
    comment:{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    likeby:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, {timestamps:true})

likeSchema.plugin(aggregatePaginate)

export const Like = model("Like", likeSchema)