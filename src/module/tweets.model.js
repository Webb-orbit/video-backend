import {model, Schema} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"


const tweetschema = new Schema({
    towner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content:{
        type: String,
        require:[true, "content is required"]
    }
},{timestamps: true})

tweetschema.plugin(aggregatePaginate)


export const Tweet = model("Tweet", tweetschema)