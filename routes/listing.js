const express= require("express");
const router= express.Router();
const wrap= require("../utils/wrap.js");
const err = require("../utils/err.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing= require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedin, isOwner}=require("../middleware.js");

//Middleware for listing Validation
const validatelisting=(req,res,next)=>{
     let result= listingSchema.validate(req.body);
      
       if(result.error){
        throw new err(400,result.error);
       }
       else{
        next();
       }
}

router.get("/",async (req,res)=>{
   const alllist= await Listing.find({});
   res.render("listings/index.ejs",{alllist});
})

//New Route
router.get("/new",isLoggedin,
  (req,res)=>{
    res.render("listings/new.ejs");
})

//Show Route
router.get("/:id",async (req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id)
    .populate({path:"reviews",
      populate:{
        path:"author"
      }
    }

    )
    .populate("owner");
    if(!list){
      req.flash('error','No Such Resort is there');
      return res.redirect("/listing");
    }
    console.log(list);
    res.render("listings/show.ejs",{list});
})

//Create Route
router.post("/",
  isLoggedin,
    validatelisting,
    wrap(async(req,res,next)=>{
       
       const newlist=new Listing(req.body.newlist);
      
       newlist.owner=req.user._id;
       
       await newlist.save();
       req.flash("success","New Listing Created!");
       res.redirect("/listing");
      
}))

//Edit Route
router.get("/:id/edit",
  isLoggedin,
   wrap(
     async(req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id);
    if(!list){
      req.flash('error','No Such Resort is there');
      return res.redirect("/listing");
    }
    
    res.render("listings/edit.ejs",{list});
    }
   )
)

//Update Route
router.put("/:id",
  isLoggedin,
  isOwner,
    validatelisting,
   wrap(
     async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);

    if(!listing.owner._id.equals(req.user._id)){
      req.flash('error','You dont have permission to Edit');
      return res.redirect(`/listing/${id}`);
    }

    await Listing.findByIdAndUpdate(id,{...req.body.newlist});
   req.flash("success","Edited Successfully");
   res.redirect(`/listing/${id}`);
    }
   )
)


//Delete Route
router.delete("/:id",
  isLoggedin,
  isOwner,
   wrap(
     async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success","Deleted Successfully");
     res.redirect("/listing");
    }
   )
)

module.exports=router;