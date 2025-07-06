const Listing = require("./models/listing")
const Review = require("./models/review")
const ExpressError = require("./utils/ExpressError")
const {listingSchema, reviewSchema} = require ("./schema")


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //Store the pre-login user page info
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login to create listing!")
        return res.redirect("/login")
    }
    next()
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.ownerRecognition = async (req, res, next) => {
    let {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "Permission denied, You are not the owner")
        return res.redirect(`/listings/${id}/edit`)
    }
    next()
}

module.exports.isReviewOwner = async (req, res, next) => {
    let {id, reviewId} = req.params
    let review = await Review.findById(reviewId)
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "Permission denied, You are not the author   ")
        return res.redirect(`/listings/${id}/`)
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    }else{
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    }else{
        next()
    }
}
