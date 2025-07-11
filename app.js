if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}
const express = require("express")
const app = express()
let port = 8080
const path = require("path")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")
const session = require('express-session');
const MongoStore = require('connect-mongo');

const listingRouter = require("./routes/listing")
const reviewRouter = require("./routes/reviews")
const userRouter = require("./routes/user")

const DBURL= process.env.ATLASDB_URL
main()
    .then(() => {
        console.log("Connection Successful")
    }).catch((err) => {
        console.log(err)
    })

async function main(){
    await mongoose.connect(DBURL)
}


app.engine("ejs", ejsMate)

app.set("views", "ejs")
app.set("views", path.join(__dirname,"views"))

app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.use(methodOverride("_method")) 

const store = MongoStore.create({
    mongoUrl: DBURL,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
})

store.on("error", () => {
    console.log("SOME ERROR OCCURED IN MONGO SESSION STORE in app.js ", err)
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    },
}



// Redirect root route to /listings
app.get('/', (req, res) => {
    res.redirect('/listings');
});

// app.get("/", (req, res) => {
//     res.send("Root route / is working and server is listening at port 8080")
// })

app.use(cookieParser())
app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser", async(req, res) => {
//     let fakeuser = new User({
//         email: "uzair@gmail.com",
//         username: "Uzair"
//     })
//     let registeredUser = await User.register(fakeuser, "helloguys")
//     res.send(registeredUser)
// })

app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


//if route doesnt match anyone address written above then below Error will land
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// })

app.use((err, req, res, next) => {
    let {status = 500, message = "Something Went Wrong"} = err;
    res.status(status).render("listings/Error.ejs", {err})
})

app.listen(port, (req, res) => {
    console.log("Server is listening at port 8080")
})