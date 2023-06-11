//jshint esversion:6
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const encrypt = require("mongoose-encryption");

const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/logout",function(req,res){
    res.render("home");
});

app.post("/register",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    const user = new User({
        email: username,
        password: password
    });

    user.save()
    .then(function(result){
        console.log("Registered user successfully");
        res.render("secrets");
    })
    .catch(function(err){
        console.log("There was an error registering this user",err);
        res.render("register");
    });

});

app.post("/login",function(req,res){
    User.findOne({email:req.body.username})
    .then(function(result){
        console.log("Found the user. Checking the password",result);
        console.log(result.password);
        console.log(req.body.password);
        if(result.password === req.body.password){
            res.render("secrets");
        }
        else {
            res.send("Enter correct password");
        }
        
    })
    .catch(function(err){
        console.log("There was an error finding this user",err);
        res.send("Please register first");
    });
});


app.listen(3000,function(){
    console.log("Server is active at port 3000");
})