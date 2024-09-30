const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require('./models/listing.js'); // Use relative path
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);    
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method")); 
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

app.get("/listing",async (req,res) =>{
 const alllisting = await Listing.find({});
 //console.log(alllisting);
 
    res.render("listings/index.ejs",{alllisting});
});

//New Route
app.get("/listings/new",(req,res) =>{
    res.render("listings/new.ejs");
})

// Show Route
app.get("/listings/:id",async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});

});

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
     throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}


const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
     throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}


//Create Route
app.post("/listing",validateListing, async (req,res,next) =>{
  try{
    const newListing =  new Listing(req.body.listing);
  await newListing.save();
    res.redirect("/listing")
  }
  catch (err) {
    next(err);
  }
});

//Edit Route
app.get("/listings/:id/edit",async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//update Route
app.put("/listings/:id",validateListing, async(req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
   res.redirect("/listing");
});

//Delete Route
app.delete("/listings/:id", async (req,res) =>{
    let {id} = req.params;
    let deltedListing = await Listing.findByIdAndDelete(id);
    console.log(deltedListing);
    res.redirect("/listing");
});

//Reviews
//Post Route
app.post("/listings/:id/reviews",validateReview,(async (req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);

    // console.log("new review saved");
    // res.send("new review saved");

}));



// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Garden Tree",
//         description: "Please like it",
//         price: 5000,
//         location: "Darbhanga, Bihar",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.all("*",(req,res,next) =>{
    next(new ExpressError(404, "Page Not Found !"));
})

app.use((err,req,res,next) =>{
    let{statusCode = 500,message = "Something went wrong !"} = err;
   res.render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
