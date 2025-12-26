const express= require("express");
const router= express.Router();
const User=require("../models/user.js");
const wrap = require("../utils/wrap.js");
const passport=require('passport');

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",
   wrap(
     async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
    const newUser= new User({email,username});
    const rUser= await User.register(newUser,password);
    console.log(rUser);
    req.flash("success",`Welcome to Stay-Scape,Mr ${username}!`);
    res.redirect("/listing");
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}
   )

)

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})


router.post("/login",passport.authenticate('local',{
    failureRedirect:"/login",
    failureFlash:true
}),
async(req,res,next)=>{
    let {username}=req.body;
    req.flash('success',`Welcome Back to Stay-Scape,Mr ${username}`);
    res.redirect('/listing');
})

module.exports=router