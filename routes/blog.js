//blog.js

const express = require('express');
const router = express.Router();
const app = express();
const multer = require('multer');
const BlogPost = require('../models/blogPostModel');

const upload = multer({ dest: 'public/img' });


// list
// Main page
router.get('/', (req, res, next)=>{

  // View all blog posts, sorted by most recently created
  BlogPost.find({})
    .sort({ createdAt: 'desc' })
    .then(blogPosts => {
      res.render('blog', {
        blogPosts : blogPosts
      });
    })
    .catch(error => {
      if (error) res.end(`Error: ${error}`);
    });
});



// Create post - page 
router.get('/create', (req, res, next)=>{
  res.render('newPost');
});



// create
// Create post - form
router.post('/', upload.single('image'), (req, res, next)=>{
  let imgPath = `/static/img/${req.file.filename}`;

  // Retrieve the form data
  const blogPostData = {
    postTitle: req.body.postTitle,
    postContent: req.body.postContent,
    imageUrl: imgPath,
    imgDescription: req.body.imgDescription
  }

  // Create a new BlogPost instance using the object above
  let blogPost = new BlogPost(blogPostData);
  
  // Save the blog post to the database, then reload the page
  blogPost.save()
    .then(() => {
      res.redirect("/blog");
    })
    .catch(error => {
      if (error) console.log(error);
    })
});



// find
// Blog post page
router.get('/post/:blogpostid', (req, res, next)=>{
  BlogPost.findOne({'_id': req.params.blogpostid})
    .then((blogPost)=>{
      res.render('blogPost', {
        blogPost: blogPost
      });
    }).catch((err)=>{
      if (err) console.log(err);
    });
});



// Edit post - page
router.get('/post/:blogpostid/edit', (req, res, next)=>{
  BlogPost.findOne({'_id': req.params.blogpostid})
    .then((blogPost)=>{
      res.render('editPost', {
        blogPost: blogPost
      });
    }).catch((err)=>{
      if (err) console.log(err);
    });
});



// update
// Edit post - form
router.post('/post/:blogpostid/edit', (req, res, next)=>{
  BlogPost.findOne({'_id': req.params.blogpostid})
    .then((blogPost)=>{
      let data  = {
        postTitle: req.body.postTitle,
        postContent: req.body.postContent,
        imgDescription: req.body.imgDescription
      }

      blogPost.set(data);
      blogPost.save().then(()=>{
        res.redirect(`/blog/post/${req.params.blogpostid}/`);
      });
    })
    .catch((err)=>{
      if (err) console.log(err);
  });
});



// delete
// Blog post edit page - delete form
router.get('/post/:blogpostid/delete', (req, res, next)=>{
  BlogPost.deleteOne({'_id': req.params.blogpostid})
    .then((blogPost)=>{
      res.redirect('/blog');
    })
    .catch((err)=>{
      if (err) console.log(err);
  });
});


module.exports = router;
