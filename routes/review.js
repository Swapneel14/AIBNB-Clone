const express= require("express");
const router= express.Router({mergeParams:true});
const wrap= require("../utils/wrap.js");
const err = require("../utils/err.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review = require("../models/review.js");
const Listing= require("../models/listing.js");
const { isLoggedin, isreviewAuthor } = require("../middleware.js");



//Middleware for Review Validation
const validatereview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);

    if (result.error) {
        throw new err(400, result.error);
    }
    else {
        next();
    }
}


//Reviews
//Post Review Route
router.post("/",
    isLoggedin,
    validatereview,
    wrap(
        async (req, res, next) => {
            let { id } = req.params;
            let list = await Listing.findById(id);
            let new_review = new Review(req.body.review);

            new_review.author=req.user._id;
            console.log(new_review)

            list.reviews.push(new_review);
            await new_review.save();
            await list.save();
            req.flash("success","Review Added");
            res.redirect(`/listing/${id}`);
        })
)


//Delete Review Route

router.delete("/:reviewid",
    isLoggedin,
    isreviewAuthor,
     wrap(
    async (req, res, next) => {
        let { id, reviewid } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } })
        await Review.findByIdAndDelete(reviewid);

        req.flash("success","Review Deleted");

        res.redirect(`/listing/${id}`);
    }
))

module.exports=router;