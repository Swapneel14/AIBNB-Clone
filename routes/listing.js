const express= require("express");
const router= express.Router();
const wrap= require("../utils/wrap.js");
const err = require("../utils/err.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing= require("../models/listing.js");
const Review = require("../models/review.js");

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
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Show Route
router.get("/:id",async (req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id).populate("reviews");
    if(!list){
      req.flash('error','No Such Resort is there');
      return res.redirect("/listing");
    }
    res.render("listings/show.ejs",{list});
})

//Create Route
router.post("/",
    validatelisting,
    wrap(async(req,res,next)=>{
       
       const newlist=new Listing(req.body.newlist);
      
       
       await newlist.save();
       req.flash("success","New Listing Created!");
       res.redirect("/listing");
      
}))

//Edit Route
router.get("/:id/edit",
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
    validatelisting,
   wrap(
     async(req,res)=>{
    let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.newlist});
   req.flash("success","Edited Successfully");
   res.redirect(`/listing/${id}`);
    }
   )
)


//Delete Route
router.delete("/:id",
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