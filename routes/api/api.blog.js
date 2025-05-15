// api.blog.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/img' });
const blogController = require('../../controllers/blogController');
const BlogService = blogController.BlogService;


router.use((req, res, next)=>{
  res.set({
  // allow any domain, allow REST methods we've implemented
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers",
  // Set content-type for all api requests
    'Content-type':'application/json'
  });
  if (req.method == 'OPTIONS'){
    return res.status(200).end();
  }
  next();
});



// LIST: Main page
router.get('/', (req, res, next)=>{

  // View all blog posts
  BlogService.list()
    .then(blogPosts => {
      res.status(200);
      res.send(JSON.stringify(blogPosts));
    })
    .catch(error => {
      if (error) res.end(`Error: ${error}`);
    });
});



// FIND: Blog post page
router.get('/post/:blogpostid', (req, res, next)=>{
  BlogService.find(req.params.blogpostid)
    .then((blogPost) => {
      console.log(`Found posts: ${blogPost}`);
      res.status(200);
      res.json(blogPost);
    })
    .catch((error) => {
     res.status(404);
     res.end();
   });
});



// CREATE: Create post
router.post('/', upload.single('image'), async (req, res, next)=>{
  const imgPath = "/static/img/" + (req.file ? req.file.filename : '');

  // Retrieve the form data
  const blogPostData = {
    postTitle: req.body.postTitle,
    postContent: req.body.postContent,
    imageUrl: imgPath,
    imgDescription: req.body.imgDescription
  }

  // Create a new BlogPost instance using the object above
  try {
    const blogPostSave = await BlogService.create(blogPostData);
    res.status(201);
    res.send(JSON.stringify(blogPostSave));
  } catch(err){
    console.log(err);
    throw new Error("Error", blogPostData);
  }
});



// UPDATE: Edit post
router.put('/post/:blogpostid', (req, res, next)=>{
  console.log(`putting ${req.params.blogpostid}`);
  let putdata = req.body;
  BlogService.update(req.params.blogpostid, putdata)
    .then((updatedBlogPost)=>{
      res.status(200);
      res.send(JSON.stringify(updatedBlogPost));
    }).catch((error)=> {
      res.status(404);
      res.end();
    });
});



// DELETE: Delete post
router.delete('/post/:blogpostid', (req, res, next)=>{
  let id = req.params.blogpostid;
  BlogService.delete(req.params.blogpostid)
    .then((blogPost) => {
      console.log(`Deleted post: ${id}`);
      res.status(200);
      res.json(blogPost);
   })
    .catch((error) => {
      res.status(404);
      res.end();
   });;
});



// error
router.use((error, req, res, next) => {
  console.error(error);
  res.status(500);
  res.end();
});

module.exports = router;
