//blogPostModel.js

const mongoose = require("mongoose");

// Get access to Schema constructor
const Schema = mongoose.Schema;

// Create a new schema
const schema = new Schema({
  postTitle: {type: String, required:true},
  postContent: {type: String, required:false},
  imageUrl: {type: String, required:true},
  imgDescription: {type: String, required:false},
  createdAt: {type: Date},
  updatedAt: {type: Date}
});

// Test to see if the current document is a new blog post or an existing post. Depending on which one it is, set the property value to today's date.
schema.pre('save', function(next) {
  if (!this.createdAt){
    this.createdAt = new Date();
  } else {
    this.updatedAt = new Date();
  }
  next();
});

// Export the model with associated name and schema
module.exports = mongoose.model("BlogPost", schema);

