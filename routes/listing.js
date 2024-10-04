const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require('../models/listing.js');

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
     throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};

router.get("/",async (req,res) =>{
    const alllisting = await Listing.find({});
    //console.log(alllisting);
    
       res.render("listings/index.ejs",{alllisting});
   });
   
   //New Route
   router.get("/new",(req,res) =>{
       res.render("listings/new.ejs");
   })
   
   // Show Route
   router.get("/:id",async(req,res) =>{
       let {id} = req.params;
       const listing = await Listing.findById(id).populate("reviews");
       res.render("listings/show.ejs",{listing});
   
   });
   
//Create Route
router.post("/",validateListing, async (req,res,next) =>{
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
  router.get("/:id/edit",async (req,res) =>{
      let {id} = req.params;
      const listing = await Listing.findById(id);
      res.render("listings/edit.ejs",{listing});
  });
  
  //update Route
  router.put("/:id",validateListing, async(req,res) =>{
      let {id} = req.params;
      await Listing.findByIdAndUpdate(id, {...req.body.listing});
     res.redirect("/listing");
  });
  
  //Delete Route
  router.delete("/:id", async (req,res) =>{
      let {id} = req.params;
      let deltedListing = await Listing.findByIdAndDelete(id);
      console.log(deltedListing);
      res.redirect("/listing");
  });

  module.exports = router;