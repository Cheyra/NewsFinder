// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
let Comment = require("./models/Comment.js");
let Article = require("./models/Article.js");
// Requiring routing controllers
let htmlRouter = require("./controllers/html-routes.js");
let articleRouter = require("./controllers/article-routes.js")
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
// Initialize Express
var app = express();
var port = process.env.PORT || 3000
var bodyParser = require('body-parser');
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// set up handlebars
app.engine(
    "handlebars",
        exphbs({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");
  // Routing
app.use("/", htmlRouter);
app.use("/", articleRouter);

// Make public a static dir
app.use(express.static("public"));


// Database configuration with mongoose
var URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news-scraper'; 
mongoose.connect(URI);
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Listen on port 3000
app.listen(port, function() {
  console.log("App running on port " + port);
});


