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
var port = process.env.PORT || 3000;
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

// Database configuration
// var databaseUrl = "news";
// var collections = ["Article"];
// var collection = ["Comment"]

// Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
// var db2 = mongojs(databaseUrl, collection);
// db.on("error", function (error) {
//     console.log("Database Error:", error);
// });

// app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.static(path.join(__dirname, 'public')));
// Make public a static dir
app.use(express.static("public"));

// mongoose.connect("mongodb://bukit:bukit1@ds031968.mlab.com:31968/bukit");
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
  console.log("App running on port 3000!");
});

// show index.handlebars on main page
// app.get("/", function (req, res) {
//     res.render("index");
// });
// app.get("/articles", function (req, res) {
//     // Find all results from the scrapedData collection in the db
//     db.Article.find({}, function (error, found) {
//         // Throw any errors to the console
//         if (error) {
//             console.log(error);
//         }
//         // If there are no errors, send the data to the browser as json
//         else {
//             res.json(found);
//         }
//     });
// });
// // app.get("/comments", function(req, res) {
// //     // Find all Notes
// //     db.Comment.find({},
// //         function (error, found) {
// //             // Throw any errors to the console
// //             if (error) {
// //                 console.log(error);
// //             }
// //             // If there are no errors, send the data to the browser as json
// //             else {
// //                 res.json(found);
// //             }
// //         });
   
// //     //   .then(function(dbComment) {
// //     //     // If all Notes are successfully found, send them back to the client
// //     //     res.json(dbComment);
// //     //   })
// //     //   .catch(function(err) {
// //     //     // If an error occurs, send the error back to the client
// //     //     res.json(err);
// //     //   });
// //   });
// app.get("/scrape", function (req, res) {
   
//     let link =[];
//     let title=[];
//     let image=[];
//     let description=[];
//         // Make a request for the news section of `ycombinator`
//     request("https://www.allsides.com/tags/story-week", function (error, response, html) {
//         // Load the html body from request into cheerio
//         var $ = cheerio.load(html);
//         // For each element with a "title" class
//         $(".node-title").each(function (i, element) {
//             // Save the text and href of each link enclosed in the current element
//              title.push($(element).children("a").text());
//              link.push($(element).children("a").attr("href"));
//             // console.log(title + link)

//             // If this found element had both a title and a link
//             // if (title && link) {
//             //     // Insert the data in the scrapedData db
//             //     db.articles.insert({
//             //         title: title,
//             //         link: link,
//             //         favorite: false
//             //     },
//             //         function (err, inserted) {
//             //             if (err) {
//             //                 // Log the error if one is encountered during the query
//             //                 console.log(err);
//             //             }
//             //             else {
//             //                 // Otherwise, log the inserted data
//             //                 console.log(inserted);
//             //             }
//             //         });
//             // }
//         });
//         $(".field-name-field-blog-main-image").each(function (i, element) {
//             image.push($(element).find("img").attr("src"));
//             //   console.log(image)
      
//         });

//         $(".field-name-body").each(function (i, element) {
//             // Save the text and href of each link enclosed in the current element
//             description.push($(element).find(".field-item").text().trim());
//             // console.log(description)

//         });
//         // if (title && link && image && description) {
//             // Insert the data in the scrapedData db
//             for(let i =0; i<link.length; i++) {
//                 db.Article.insert({
//                 title: title[i],
//                 link: link[i],
//                 image: image[i],
//                 description: description[i],
//                 favorite: false
//             })
//             // .then(function(dbArticle) {
//             //     console.log(dbArticle);
//             //   })
//             //   .catch(function(err) {
//             //     console.log(err.message);
//             //   });
//         }
//                 // function (err, inserted) {
//                 //     if (err) {
//                 //         // Log the error if one is encountered during the query
//                 //         console.log(err);
//                 //     }
//                 //     else {
//                 //         // Otherwise, log the inserted data
//                 //         console.log(inserted);
//                 //     }
//                 // };
                  

//     });
//     // Send a "Scrape Complete" message to the browser
//     res.send("Scrape Complete");
// });



// // Favorite an article
// app.post("/favorite/:id", function(req, res) {
//     // Use the article id to find and update it's saved property to true
//     db.Article.findOneAndUpdate({ "_id": req.params.id }, { "favorite": true })
//     // Execute the above query
//     .exec(function(err, doc) {
//       // Log any errors
//       if (err) {
//         console.log(err);
//       }
//       // Log result
//       else {
//         console.log("doc: ", doc);
//       }
//     });
//   });
  
  
//   // ============= ROUTES FOR SAVED ARTICLES PAGE =============//
  
//   // Grab an article by it's ObjectId
//   app.get("/articles/:id", function(req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     db.Article.findOne({ "_id": req.params.id })
//     // ..and populate all of the comments associated with it
//     .populate("comments")
//     // now, execute our query
//     .exec(function(error, doc) {
//       // Log any errors
//       if (error) {
//         console.log(error);
//       }
//       // Otherwise, send the doc to the browser as a json object
//       else {
//         res.json(doc);
//       }
//     });
//   });
  
//   // Create a new comment
//   app.post("/comment/:id", function(req, res) {
//     // Create a new comment and pass the req.body to the entry
//     var newComment = new Comment(req.body);
//     // And save the new comment the db
//     newComment.save(function(error, newComment) {
//       // Log any errors
//       if (error) {
//         console.log(error);
//       }
//       // Otherwise
//       else {
//         // Use the article id to find and update it's comment
//         db.Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "comments": newComment._id }}, { new: true })
//         // Execute the above query
//         .exec(function(err, doc) {
//           // Log any errors
//           if (err) {
//             console.log(err);
//           }
//           else {
//             console.log("doc: ", doc);
//             // Or send the document to the browser
//             res.send(doc);
//           }
//         });
//       }
//     });
//   });
  
//   // Remove a saved article
//   app.post("/unfavorite/:id", function(req, res) {
//     // Use the article id to find and update it's saved property to false
//     db.Article.findOneAndUpdate({ "_id": req.params.id }, { "favorite": false })
//     // Execute the above query
//     .exec(function(err, doc) {
//       // Log any errors
//       if (err) {
//         console.log(err);
//       }
//       // Log result
//       else {
//         console.log("Article Removed");
//       }
//     });
//     // res.redirect("/saved");
//   });
  
  
// // app.post("/submit", function(req, res) {
// //     // Create a new Note in the db
// //     db.Comment.insert(req.body)
// //       .then(function(dbComment) {
// //          return db.Article.findOneAndUpdate({}, { $push: { comments: dbComment._id } }, { new: true });
// //       })
// //       .then(function(dbArticle) {
// //         // If the User was updated successfully, send it back to the client
// //         res.json(dbArticle);
// //       })
// //       .catch(function(err) {
// //         // If an error occurs, send it back to the client
// //         res.json(err);
// //       });
// //   });


// // Listen on port 3000
// app.listen(3000, function () {
//     console.log("App running on port 3000!");
// });
