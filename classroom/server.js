const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretcode"));

app.get("/getsignedcookie",(req,res) =>{
    res.cookie("made-in","India",{signed:true});
    res.send("signed cookie sent");
});

app.get("/verify",(req,res) =>{
    console.log(req.signedCookies);
    res.send("verified");
})

app.get("/getcookies", (req,res) =>{
    res.cookie("greet", "Namaste");
    res.cookie("madeIn", "India")
    res.send("sent you some cookies!");
});

app.get("/greet", (req,res) =>{
    let {name = "anonymous"} = req.cookies;
    res.send(`Hi, ${name}`);
})

app.get("/" ,(req,res) =>{
    console.dir(req.cookies);
    res.send("Hi, I am root!");
});

app.use("/users", users);
app.use("/post", posts);

app.listen(3000, () =>{
    console.log("Server is listening to 3000");
})