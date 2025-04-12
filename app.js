// app.js

const express = require('express');
const path = require('path');
const blog = require('./routes/blog');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()

const app = express();

// Connect to the Mongo database
// (Environment variables are in the .env file)
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.pqqfs1i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .catch(error => {
    console.error(`database connection error: ${error}`);
    process.exit();
  });

// Bodyparser package for parsing POST form data
app.use(bodyparser.urlencoded({extended: false}));

// Static file path (where the images will be stored)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Tells express where to find the views
app.set('views', path.join(__dirname, 'views'));

// Tells express to use pug as the template engine
app.set('view engine', 'pug');


app.get('/', (req, res)=>{
  res.end("Placeholder middleware to demonstrate handling a request for the '/' root path")
});

// Mount the 'blog' router as middleware on the appropriate path
app.use('/blog', blog);


// Error handling
app.use((req, res, next)=>{
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
