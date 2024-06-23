import mongoose from "mongoose";

const tweetSchema = mongoose.Schema({
    description: {
        type:String,
        required:true
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    userDetails:{
        type:Array,
        default:[]
    }
},{timestamps: true})

export const Tweet = mongoose.model("Tweet",tweetSchema); 