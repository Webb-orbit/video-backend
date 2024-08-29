import { model, Schema } from "mongoose";

const subscriptionschma = new Schema({
    subcriber:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channal:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})

export const Subscription = model("Subscription", subscriptionschma)