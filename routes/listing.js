const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require('../models/listing.js');

// Validation Middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Index Route - List all listings
router.get("/", async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listings/index.ejs", { alllisting });
});

// New Listing Form Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show Route - Show a specific listing
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
});

// Create Route - Add a new listing
router.post("/", validateListing, async (req, res, next) => {
    console.log("Request Body:",req.body);
    try {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listings"); // Updated to '/listings'
    } catch (err) {
        next(err);
    }
});

// Edit Route - Edit a specific listing
router.get("/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

// Update Route - Update a specific listing
router.put("/:id", validateListing, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings"); // Updated to '/listings'
});

// Delete Route - Delete a specific listing
router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings"); // Updated to '/listings'
});

module.exports = router;
