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
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");

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

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    next();
});

// Use the listings routes
app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews);

// Redirect root route to listings
app.get("/", (req, res) => {
    res.redirect("/listings");
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
