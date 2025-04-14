// app.js

require('dotenv').config();
const express = require('express');
const path = require('path');
const blog = require('./routes/blog');
const apiblog = require('./routes/api/api.blog');
const mongoose = require('mongoose');

// Connect to the Mongo database
// (Environment variables are in the .env file)
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.pqqfs1i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .catch(error => {
    console.error(`database connection error: ${error}`);
    process.exit();
  });

// Initialize express
const app = express();

// Built-in bodyparser for parsing POST form data
app.use(express.urlencoded({extended: false}));

// Json
app.use(express.json());

// Static file path (where the images will be stored)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Tells express where to find the views
app.set('views', path.join(__dirname, 'views'));

// Tells express to use pug as the template engine
app.set('view engine', 'pug');

app.get('/', (req, res)=>{
  res.end("Placeholder middleware to demonstrate handling a request for the '/' root path")
});

// Mount the routers as middleware on the appropriate paths
app.use('/blog', blog);
app.use('/api/blog', apiblog);


// Error handling
app.use((req, res, next)=>{
  const err = new Error('Not Found' + req.url);
  err.status = 404;
  next(err);
});

module.exports = app;
