const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")
const Listing = require("../models/listing")
const Review = require("../models/review")
const { isLoggedIn, validateReview, isReviewOwner } = require("../middleware")
const review = require("../models/review")
const reviewController = require("../controllers/reviewController")


//Review Adding to DB Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

//Delete Reviews Route
router.delete("/:reviewId", isLoggedIn, isReviewOwner,  wrapAsync(reviewController.destroyReview))

module.exports = router;