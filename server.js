var express = require("express");
var axios = require("axios");

// DB Packages
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var logger = require("morgan");

var db = require("./models");


var PORT =process.env.PORT ||3000 ;
var app = express();

// Mongo Setup
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var databaseuri = "mongodb://localhost/newsScraper";

/* if (process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI);
}

else{
    mongoose.connect(databaseuri);
} */

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }); 

// Handlebars setup
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");




// Routes

app.get("/", (req,res)=>{
    res.render("home");
});

app.get("/scrape", (req,res)=>{
    axios.get("https://www.technologyreview.com/").then((response)=>{

    var $ = cheerio.load(response.data);

    $(".grid-tz__title .grid-tz__title--link").each((i,element)=>{
    var result = {};
    
    result.title = $(element).text();
    result.link = "https://www.technologyreview.com"+  $(element).attr("href");
    
    
     db.Column.create(result)
        .then(function(dbColumn) {
            console.log(dbColumn);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });


});

res.send("Scrape completed, now go back to the home page!");

});


app.get("/articles", (req,res)=>{
    db.Column.find()

    .then((dbColumn)=>{
    res.json(dbColumn);
    })

    .catch((err)=>{
    res.json(err);
    });
});


app.get("/articles/:id", function(req, res) {
    
    db.Column.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
       
        return db.Column.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

app.delete("/articles/:id", function(req, res) {

    db.Note.remove({id: [req.params.id]});
       
  });

  


app.listen(PORT,()=>{
    console.log("App is running on Port " + PORT);
})