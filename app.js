const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongolink = "mongodb://127.0.0.1:27017/wanderlust";
const path = require('path');
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session= require('express-session');
const flash= require('connect-flash');

const sessionoptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000
    }
};



main()
    .then(() => {
        console.log('connected to mongo');
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(mongolink);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodoverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Hi I am Root");
})

app.use(session(sessionoptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success= req.flash('success');
    next();
})

app.use("/listing", listings);
app.use("/listing/:id/reviews",reviews);

//Custom Error Handler
app.use((err, req, res, next) => {
    let { status = 500, message = "Some Error Occured" } = err;
    res.status(status).render("listings/error.ejs", { message });
});
app.listen(8080, () => {
    console.log("Server is listenning to post 8080");
});