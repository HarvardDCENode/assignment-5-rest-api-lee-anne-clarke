//blog.js

const express = require('express');
const router = express.Router();
const app = express();
const multer = require('multer');
const BlogPost = require('../models/blogPostModel');
const upload = multer({ dest: 'public/img' });
const blogController = require('../controllers/blogController');
const BlogService = blogController.BlogService;


router.use((req, res, next)=>{
  res.set({
  // Allow any domain & allow REST methods we've implemented
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers",
  });
  if (req.method == 'OPTIONS'){
    return res.status(200).end();
  }
  next();
});


// Main page
router.get('/', (req, res, next)=>{

  // View all blog posts, sorted by most recently created
  BlogService.list()
    .then(blogPosts => {
      res.render('blog', {
        blogPosts : blogPosts
      });
    })
    .catch(error => {
      if (error) res.end(`Error: ${error}`);
    });
});



// Blog post page
router.get('/post/:blogpostid', (req, res, next)=>{
  BlogService.find(req.params.blogpostid)
    .then(blogPost => {
      res.render('blogPost', {
        blogPost: blogPost
      });
    })
    .catch(error => {
      console.log(error);
    });
});



// Create new post page 
router.get('/create', (req, res, next)=>{
  res.render('newPost');
});



// Create new post (form submission)
router.post('/', upload.single('image'), (req, res, next)=>{
  const imgPath = "/static/img/" + (req.file ? req.file.filename : '');

  // Retrieve the form data
  const blogPostData = {
    postTitle: req.body.postTitle,
    postContent: req.body.postContent,
    imageUrl: imgPath,
    imgDescription: req.body.imgDescription
  }

  // Create a new BlogPost instance using the object above
  BlogService.create(blogPostData)
    .then(() => {
      res.redirect("/blog");
    })
    .catch(error => {
      console.log(error);
    })
});



// Blog post edit page
router.get('/post/:blogpostid/edit', (req, res, next)=>{
  BlogService.find(req.params.blogpostid)
    .then((blogPost)=>{
      res.render('editPost', {
        blogPost: blogPost
      });
    }).catch((err)=>{
      if (err) console.log(err);
    });
});



// Blog post edit (form submission)
router.post('/post/:blogpostid', (req, res, next)=>{
  const data = {
    postTitle: req.body.postTitle,
    postContent: req.body.postContent,
    imgDescription: req.body.imgDescription
  }

  BlogService.update(req.params.blogpostid, data)
  .then(() => {
    res.redirect(`/blog/post/${req.params.blogpostid}/`);
  })
  .catch(error => {
    console.log(error);
  });
});



// Blog post delete (form submission)
router.get('/post/:blogpostid', (req, res, next)=>{
  BlogService.delete(req.params.blogpostid)
    .then((obj) => {
      res.redirect('/blog');
    })
    .catch(error => {
      console.log(error);
  });
});


module.exports = router;
