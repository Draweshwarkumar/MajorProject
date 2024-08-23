const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require('./models/listing.js'); // Use relative path
const port = 8080;

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);    
}

app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title: "My New Garden Tree",
        description: "Please like it",
        price: 5000,
        location: "Darbhanga, Bihar",
        country: "India",
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
});

app.get("/", (req, res) => {
    res.send("Hello, my name is Shivam!");
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
