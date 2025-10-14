const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing= require("../models/listing.js");

const mongolink="mongodb://127.0.0.1:27017/wanderlust";

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
const initdb= async ()=>{
   await Listing.deleteMany({});
   await Listing.insertMany(initdata.data);
   console.log("Data was initialized");
}

initdb();