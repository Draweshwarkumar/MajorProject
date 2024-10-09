const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");
const Listing = require('./models/listing.js'); // Use relative path
const Review = require("./models/review.js");
const listings = require("./routes/listing.js"); // Import listings routes

const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// DB Connection
async function main() {
    await mongoose.connect(MONGO_URL);    
}

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

// Middleware & Config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Validation Middleware for Reviews
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Use the listings routes
app.use("/listings", listings);

// Reviews Routes
app.post("/listings/:id/reviews", validateReview, async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
});

// Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
});

// Catch-all Route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Server Listener
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
