// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

// Initialize Express
var app = express();

// set up handlebars
app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");

// Database configuration
var databaseUrl = "news";
var collections = ["Article", ];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect("mongodb://bukit:bukit1@ds031968.mlab.com:31968/bukit");

// show index.handlebars on main page
app.get("/", function (req, res) {
    res.render("index");
});
app.get("/articles", function (req, res) {
    // Find all results from the scrapedData collection in the db
    db.Article.find({}, function (error, found) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as json
        else {
            res.json(found);
        }
    });
});
app.get("/comments", function(req, res) {
    // Find all Notes
    db.Comment.find({})
      .then(function(dbComment) {
        // If all Notes are successfully found, send them back to the client
        res.json(dbComment);
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });
app.get("/scrape", function (req, res) {
   
    let link =[];
    let title=[];
    let image=[];
    let description=[];
        // Make a request for the news section of `ycombinator`
    request("https://www.allsides.com/tags/story-week", function (error, response, html) {
        // Load the html body from request into cheerio
        var $ = cheerio.load(html);
        // For each element with a "title" class
        $(".node-title").each(function (i, element) {
            // Save the text and href of each link enclosed in the current element
             title.push($(element).children("a").text());
             link.push($(element).children("a").attr("href"));
            // console.log(title + link)

            // If this found element had both a title and a link
            // if (title && link) {
            //     // Insert the data in the scrapedData db
            //     db.articles.insert({
            //         title: title,
            //         link: link,
            //         favorite: false
            //     },
            //         function (err, inserted) {
            //             if (err) {
            //                 // Log the error if one is encountered during the query
            //                 console.log(err);
            //             }
            //             else {
            //                 // Otherwise, log the inserted data
            //                 console.log(inserted);
            //             }
            //         });
            // }
        });
        $(".field-name-field-blog-main-image").each(function (i, element) {
            image.push($(element).find("img").attr("src"));
            //   console.log(image)
      
        });

        $(".field-name-body").each(function (i, element) {
            // Save the text and href of each link enclosed in the current element
            description.push($(element).find(".field-item").text().trim());
            // console.log(description)

        });
        // if (title && link && image && description) {
            // Insert the data in the scrapedData db
            for(let i =0; i<link.length; i++) {
                db.Article.insert({
                title: title[i],
                link: link[i],
                image: image[i],
                description: description[i],
                favorite: false
            })
            // .then(function(dbArticle) {
            //     console.log(dbArticle);
            //   })
            //   .catch(function(err) {
            //     console.log(err.message);
            //   });
        }
                // function (err, inserted) {
                //     if (err) {
                //         // Log the error if one is encountered during the query
                //         console.log(err);
                //     }
                //     else {
                //         // Otherwise, log the inserted data
                //         console.log(inserted);
                //     }
                // };
                  

    });
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});
app.post("/submit", function(req, res) {
    // Create a new Note in the db
    db.Comment.insert(req.body)
      .then(function(dbComment) {
         return db.Article.findOneAndUpdate({}, { $push: { comments: dbComment._id } }, { new: true });
      })
      .then(function(dbArticle) {
        // If the User was updated successfully, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });


// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});
