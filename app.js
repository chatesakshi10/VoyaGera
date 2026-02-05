const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js")
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
app.get("/listings", wrapAsync(async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching listings");
    }
}));

//NEW
app.get("/listings/new" , (req, res) =>{
    res.render("listings/new.ejs");

});
//Create Route
app.post(
    "/listings",
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        let result = listingSchema.validate(req.body);
        console.log(result);
        await newListing.save();
        res.redirect("/listings");
    })
);

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));


//Update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
}));
//Delete route

app.delete("/listings/:id", wrapAsync(async(req,res) => {
    const { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);;
    console.log(deleted);
    res.redirect("/listings");
}));

app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

// app.use((err, req, res, next) => {
//     let{ statusCode = 500 , message="Something went wrong!"}=err ;
//     res.render("error.ejs" , {message});
//     //res.status(statusCode).send(message);
// });
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).render("error.ejs", { err });
});



app.listen(8080 ,() =>{
    console.log("server is listening to port");
});