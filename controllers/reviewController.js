const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")
const Listing = require("../models/listing")
const Review = require("../models/review")
const { isLoggedIn, validateReview, isReviewOwner } = require("../middleware")
const review = require("../models/review")

module.exports.createReview = async (req, res) => {
    let listingz = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id;
    console.log(newReview)

    listingz.reviews.push(newReview)
    await newReview.save()
    await listingz.save()

    req.flash("success", "Added review successfully!")

    res.redirect(`/listings/${listingz._id}`)
}

module.exports.destroyReview = async(req, res) => {
    let {id, reviewId} = req.params
    await Listing.findByIdAndUpdate(id, {$pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Review deleted!")

    res.redirect(`/listings/${id}`);
}