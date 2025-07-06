const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("../models/user")
const { saveRedirectUrl } = require("../middleware")


module.exports.signUpPage = async (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.creatingUser = async (req, res) => {
    try{
        let {email, username, password} = req.body
        const newUser = new User({email, username})
        const registered = await User.register(newUser, password)
        console.log(registered)
        req.login(registered, (err) => {
            if(err){
                next(err)
            }
            req.flash("success", "You made it!")
            res.redirect("/listings")
        })
    }catch(err){
        req.flash("error",err.message)
        res.redirect("/signup")
    }
}

module.exports.login = async (req, res) => {
    res.render("users/login.ejs")
}

module.exports.authenticateUser = async (req, res) => {
    req.flash("success", "Congratulations on successful login!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)

}

module.exports.logout = async (req, res, next) => {
    req.logout((err) => {
        if(err){
        next(err)
    }
    req.flash("success", "Logged Out Successfully")
    res.redirect("/login")
    })
}