const Listing= require("./models/listing.js");
const Review= require("./models/review.js");

module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectURL=req.originalUrl;
        req.flash("error","You are not Logged in to Stay-Scape");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectURL){
        res.locals.redirectURL=req.session.redirectURL;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
     let {id}=req.params;
    let listing=await Listing.findById(id);

    if(!listing.owner._id.equals(req.user._id)){
      req.flash('error','You dont have permission to make changes');
      return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isreviewAuthor=async(req,res,next)=>{
     let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid);

    if(!review.author._id.equals(req.user._id)){
      req.flash('error','You dont have permission to make changes');
      return res.redirect(`/listing/${id}`);
    }
    next();
}