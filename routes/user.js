const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("../models/user")
const { saveRedirectUrl } = require("../middleware")
const userController = require("../controllers/userController")


router
    .route("/signup")
    .get( userController.signUpPage)                        //Render Signup Page
    .post( wrapAsync( userController.creatingUser))         //Signup

router
    .route("/login")
    .get( userController.login)            //Render Login Form
    .post( saveRedirectUrl, passport.authenticate("local", {failureRedirect:"/login", failureFlash:true}),userController.authenticateUser)                                 //Login

router.get("/logout", userController.logout)




module.exports = router