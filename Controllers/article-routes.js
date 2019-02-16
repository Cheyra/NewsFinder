var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var Comment = require("../Models/Comment.js");
var Article = require("../Models/Article.js");
var router = express.Router();


// ============= ROUTES FOR HOME PAGE =============//

// Scrape data from NPR website and save to mongodb
router.get("/scrape", function(req, res) {
  // Grab the body of the html with request
  request("https://www.allsides.com/tags/story-week", function(error, response, html) {
    // Load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    let link =[];
    let title=[];
    let image=[];
    let description=[];
    // Grab every part of the html that contains a separate article
    $(".node-title").each(function(i, element) {
   // Save the text and href of each link enclosed in the current element
   title.push($(element).children("a").text());
   link.push($(element).children("a").attr("href"));
    });
    $(".field-name-field-blog-main-image").each(function (i, element) {
        image.push($(element).find("img").attr("src"));
        
    });
    $(".field-name-body").each(function (i, element) {
        // Save the text and href of each link enclosed in the current element
        description.push($(element).find(".field-item").text().trim());
      });
        // Save an empty result object
     
        for(let i =0; i<link.length; i++) {
            var result = {};
            result.title = title[i];
            result.description = description[i];
            result.link = link[i];
            result.image = image[i]

      // Using our Article model, create a new entry
      var entry = new Article(result);
      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    };
    // Reload the page so that newly scraped articles will be shown on the page
    res.redirect("/");
  });  
});


// This will get the articles we scraped from the mongoDB
router.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({})
  // Execute the above query
  .exec(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Save an article
router.post("/favorite/:id", function(req, res) {
  // Use the article id to find and update it's saved property to true
  Article.findOneAndUpdate({ "_id": req.params.id }, { "favorite": true })
  // Execute the above query
  .exec(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    // Log result
    else {
      console.log("doc: ", doc);
    }
  });
});


// ============= ROUTES FOR SAVED ARTICLES PAGE =============//

// Grab an article by it's ObjectId
router.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the comments associated with it
  .populate("comments")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});
router.get("/comment", function(req, res) {
  Comment.find({})
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});
// Create a new comment
router.post("/comment/:id", function(req, res) {
  // Create a new comment and pass the req.body to the entry
  var newComment = new Comment(req.body);
  // And save the new comment the db
  newComment.save(function(error, newComment) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's comment
      Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "comments": newComment._id }}, { new: true })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          console.log("doc: ", doc);
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});

// Remove a saved article
router.post("/unfavorite/:id", function(req, res) {
  // Use the article id to find and update it's saved property to false
  Article.findOneAndUpdate({ "_id": req.params.id }, { "favorite": false })
  // Execute the above query
  .exec(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    // Log result
    else {
      console.log("Article Removed");
    }
  });
  res.redirect("/");
});


module.exports = router;