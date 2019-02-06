var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `name` must be unique and of type String
  title: {
    type: String,
    unique: true
  },
  link: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    unique: true
  },
  image: {
    type: String,
    unique: true
  },

  comments: [
    {
      // Store ObjectIds in the array
      type: Schema.Types.ObjectId,
      // The ObjectIds will refer to the ids in the Note model
      ref: "comment"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("article", ArticleSchema);

// Export the User model
module.exports = Article;
