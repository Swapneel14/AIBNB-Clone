const express= require("express");
const router= express.Router();
const User=require("../models/user.js");
const wrap = require("../utils/wrap.js");
const passport=require('passport');
const { saveRedirectUrl } = require("../middleware.js");


//SignUp-GET
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

//SignUp-POST
router.post("/signup",
   wrap(
     async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
    const newUser= new User({email,username});
    const rUser= await User.register(newUser,password);
    console.log(rUser);
    req.login(rUser,(err)=>{
        if(err){
            return next(err);
        }
       req.flash("success",`Welcome to Stay-Scape,Mr ${username}!`);
       res.redirect("/listing");
    })
   
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}
   )

)

//Login-GET
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

//Login-Post
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate('local',{
    failureRedirect:"/login",
    failureFlash:true
}),
async(req,res,next)=>{
    let {username}=req.body;
    req.flash('success',`Welcome Back to Stay-Scape,Mr ${username}`);
    let url=res.locals.redirectURL||"/listing";
    res.redirect(url);
})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash('success',"Logged out Successfully!!");
        res.redirect("/listing");
    })
})

module.exports=router