const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
//const listing = require("./models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);

}
main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.set("view engine" , "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req ,res) => {
    res.send("Hii , I am a root");

});




// index
app.get("/listings", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching listings");
    }
});

//NEW
app.get("/listings/new" , (req, res) =>{
    res.render("listings/new.ejs");

});
//Create Route
app.post("/listings" , async(req ,res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")

});
// /
// EDIT ROUTE
// app.get("/listings/:id/edit", async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
// });
app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});


//Update route
app.put("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
});
//Delete route

app.delete("/listings/:id", async(req,res) => {
    const { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);;
    console.log(deleted);
    res.redirect("/listings");
});


//show
// app.get("/listings/:id" , async(req ,res)  => {
//     let {id} =  req.params;
//     const listings = await Listing.findById(id);
//     res.render("listings/show.ejs", {listings});

// });
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});



// app.get("/listings" , (req,res) => {
//     listing.find({}).then((res)=>{
//         console.log(res);
//     });

// });

// app.get("/testListing" ,async(req ,res) => {
//     let sampleListing = new Listing({
//         title : "My new Villa",
//         description : "By the beach",
//         price : 1200,
//         location : "Calangute ,Goa",
//         country : "India",

//     });
//     await sampleListing.save();
//     console.log("Sample was saved!");
//     res.send("successful");

// });
app.listen(8080 ,() =>{
    console.log("server is listening to port");
});