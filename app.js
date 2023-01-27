//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://prathamGoel:pratham123@cluster0.wgktfxg.mongodb.net/UserDB');
}

app.get("/", function (req, res) { res.render("home"); });
app.get("/login", function (req, res) { res.render("login"); });
app.get("/register", function (req, res) { res.render("register"); });


const UserSchema = new mongoose.Schema({
    email: String,
    password: String
});


UserSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });


const User = mongoose.model("User", UserSchema);

app.post("/register", function (req, res) {

    const UserData = new User({
        email: req.body.username,
        password: req.body.password
    });

    UserData.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});


app.post("/login", function (request, response) {

    const username = request.body.username;
    const password = request.body.password;

    User.findOne({ email: username }, function (err, foundlist) {

        if (err) {
            console.log(err);
        } else {
            if (foundlist) {
                if (foundlist.password === password) {
                    response.render("secrets");
                }
            }
        }
    });
});










app.listen(3000, function () {
    console.log("Server started on port 3000");
});