const express= require("express");
const app= express();
const mongoose= require("mongoose");
const mongolink="mongodb://127.0.0.1:27017/wanderlust";
const Listing= require("./models/listing.js");
const path=require('path');
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
main()
.then(()=>{
    console.log('connected to mongo');
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(mongolink);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hi I am Root");
})

app.get("/listing",async (req,res)=>{
   const alllist= await Listing.find({});
   res.render("listings/index.ejs",{alllist});
})
app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs");
})
app.get("/listing/:id",async (req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id);
    res.render("listings/show.ejs",{list});
})

app.post("/listing",async(req,res)=>{
   const newlist=new Listing(req.body.newlist);
   await newlist.save();
   res.redirect("/listing");
})
app.get("/listing/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id);
    res.render("listings/edit.ejs",{list});
})
app.put("/listing/:id",async(req,res)=>{
    let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.list});
   res.redirect(`/listing/${id}`);
})
app.get("/testlisting",async(req,res)=>{
    let sample=new Listing({
        title:"My Villa",
        description:"by the beach",
        price:1200,
        location:"Goa",
        country:"India"
    })
    await sample.save();
    console.log("saved");
    res.send("Succesful testing");
})

app.delete("/listing/:id",async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndDelete(id);
     res.redirect("/listing");
})
app.listen(8080,()=>{
    console.log("Server is listenning to post 8080");
});