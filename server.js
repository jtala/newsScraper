var express = require("express");
var axios = require("axios");

// DB Packages
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var logger = require("morgan");


var PORT = 3000;
var app = express();

// Mongo Setup
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Handlebars setup
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

/* var db = require("/models");
 */



// Routes

app.get("/", (req,res)=>{
    res.render("home");
});

app.get("/scrape", (req,res)=>{
    axios.get("https://www.technologyreview.com/").then((response)=>{

    var $ = cheerio.load(response.data);
    /* var check = $(".grid-tz__title .grid-tz__title--link").text();
    console.log(check); */

    $(".grid-tz__title .grid-tz__title--link").each((i,element)=>{


    var result = {};

    result.title = $(this).text();

    console.log(result);

    });
});

res.send("Scrape completed");
});




app.listen(PORT,()=>{
    console.log("App is running on Port " + PORT);
})