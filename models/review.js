const mongoose = require("mongoose")
const { Schema } = mongoose


let reviewSchema = new Schema({
    comment:{
        type: String,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    createdAt : {
        type:Date,
        default:Date.now()
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },

})

module.exports = mongoose.model("Review", reviewSchema)

