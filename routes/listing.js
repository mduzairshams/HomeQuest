const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")
const Listing = require("../models/listing")
const {listingSchema, reviewSchema} = require ("../schema")
const { isLoggedIn, ownerRecognition, validateListing } = require("../middleware")
const listingController = require("../controllers/listingController")
const multer = require("multer")
const {storage} = require("../cloudConfig")
const upload = multer({ storage } )


router
    .route("/")
    .get(wrapAsync(listingController.index))                            //Index Route 
    .post(isLoggedIn,validateListing, upload.single("listings[image]"), wrapAsync(listingController.add))            //Adding to DB

//Create Route Form for taking input from user
router.get("/new", isLoggedIn, listingController.newListing)

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))                      //Show route
    .put(isLoggedIn, ownerRecognition, upload.single("listings[image]"), validateListing, wrapAsync(listingController.updateInDB))    //Update to DB route
    .delete( isLoggedIn, ownerRecognition, wrapAsync(listingController.deleteListing))              //Destroy Route


//Edit Route renders form to get info
router.get("/:id/edit", isLoggedIn, ownerRecognition, wrapAsync(listingController.editListing))




module.exports = router