const mongoose = require('mongoose'); // Import mongoose
const Schema = mongoose.Schema; // Get the Schema class from mongoose

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg",
        set: (v) =>
            v === ""
            ? "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg"
            : v,
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
