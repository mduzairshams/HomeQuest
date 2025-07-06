const mongoose = require("mongoose")
const { Schema } = mongoose
const Review = require("./review")

let listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
     },
  image: {
    filename:String,
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1662622197524-f2788a38b884?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGV5ZSUyMGNhdGNoeSUyMG1vdW50YWluc3xlbnwwfHwwfHx8MA%3D%3D",
      set: (v) => (v === "" ? "https://images.unsplash.com/photo-1662622197524-f2788a38b884?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGV5ZSUyMGNhdGNoeSUyMG1vdW50YWluc3xlbnwwfHwwfHx8MA%3D%3D" : v),
    },
  },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type:{
            type: String,
            enum: ['Point'],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews } } )
    }
})

let Listing = new mongoose.model( "Listing",listingSchema)
module.exports = Listing;