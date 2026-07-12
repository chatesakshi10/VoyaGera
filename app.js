const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const listings = require("./routes/listings");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const MONGO_URL = process.env.MONGO_URL;
const port = process.env.PORT || 3000;

// Database
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => console.log("Connected to DB"))
    .catch(console.log);

// Middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/listings", listings);

app.get("/", (req, res) => {
    res.redirect("/listings");
});

// Review Route
app.post("/listings/:id/reviews", async (req, res, next) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        const review = new Reviewa(req.body.review);

        listing.reviews.push(review);

        await review.save();
        await listing.save();

        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
});

// Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});