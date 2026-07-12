const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

router.post(
    "/listings/:id/reviews",
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        const review = new Review(req.body.review);

        listing.reviews.push(review);

        await review.save();
        await listing.save();

        res.redirect(`/listings/${id}`);
    })
);

module.exports = router;