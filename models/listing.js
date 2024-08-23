const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    Image: {
        type: String,
        default:
            "https://unsplash.com/photos/red-and-brown-leafy-tree-at-daytime-Bn2rzIYM53g",
        set: (v) => 
            v === ""
            ? "https://unsplash.com/photos/red-and-brown-leafy-tree-at-daytime-Bn2rzIYM53g"
            : v,
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; // Corrected export statement
