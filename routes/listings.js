const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");

// Validate Listing Middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(", "));
    }

    next();
};

// ======================
// INDEX Route
// GET /listings
// ======================
router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    })
);

// ======================
// NEW Route
// GET /listings/new
// ======================
router.get("/new", (req, res) => {
    res.render("listings/new");
});

// ======================
// SHOW Route
// GET /listings/:id
// ======================
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        res.render("listings/show", { listing });
    })
);

// ======================
// CREATE Route
// POST /listings
// ======================
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();

        res.redirect("/listings");
    })
);

// ======================
// EDIT Route
// GET /listings/:id/edit
// ======================
router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        res.render("listings/edit", { listing });
    })
);

// ======================
// UPDATE Route
// PUT /listings/:id
// ======================
router.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        await Listing.findByIdAndUpdate(id, req.body.listing, {
            runValidators: true,
            new: true,
        });

        res.redirect(`/listings/${id}`);
    })
);

// ======================
// DELETE Route
// DELETE /listings/:id
// ======================
router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        await Listing.findByIdAndDelete(id);

        res.redirect("/listings");
    })
);

module.exports = router;