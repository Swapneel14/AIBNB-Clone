const mongoose= require("mongoose");
const Schema=mongoose.Schema;
const d="https://thumbs.dreamstime.com/b/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available-236105299.jpg"
const Review =require("./review.js")

const ListSchema= new Schema({
         title:{
            type: String,
            required:true
         },
         description:String,
         image: {
  filename: String,
  url: {
    type: String,
    default: d,
    set: (v) => v === "" ? d : v
  }
},
         price:Number,
         location:String,
         country:String,
         reviews:[
          {
            type:Schema.Types.ObjectId,
            ref:"Review"
          }
         ],
         owner:{
          type:Schema.Types.ObjectId,
          ref:"User"
         }
});

ListSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
     await Review.deleteMany({_id: {$in: listing.reviews}});
  }
  
})

const Listing= mongoose.model("Listing",ListSchema);
module.exports=Listing;