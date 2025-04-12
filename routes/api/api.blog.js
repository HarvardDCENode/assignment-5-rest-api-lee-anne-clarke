// api.blog.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/img' });
const blogController = require('../../controllers/blogController');
const BlogService = blogController.BlogService;


router.use((req, res, next)=>{
  res.set({
  // Allow any domain & allow REST methods we've implemented
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



// list: Main page
router.get('/', (req, res, next)=>{

  // View all blog posts, sorted by most recently created
  BlogPost.list()
    .sort({ createdAt: 'desc' })
    .then(blogPosts => {
      res.status(200);
      res.send(JSON.stringify(blogPosts));
    })
    .catch(error => {
      if (error) res.end(`Error: ${error}`);
    });
});



// find: Blog post page
router.get('/post/:blogpostid', (req, res, next)=>{
  BlogPost.find(req.params.blogpostid)
    .then((blogPost) => {
      console.log(`Found posts: ${blogPost}`);
      res.status(200);
      res.send(JSON.stringify(blogPost));
    })
    .catch((error) => {
     res.status(404);
     res.end();
   });
});



// Create post page 
// !! TODO !!



// create: Create post form
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
    const blogPostSave = await BlogService.create(blogPost);
		res.status(201);
		res.send(JSON.stringify(blogPostSave));
	} catch(err){
		console.log(err);
		throw new Error("BlogPost save error", blogPost);
	}
});



// Edit post page
// !! TODO !!



// update: Edit post form
router.put('/post/:blogpostid/edit', (req, res, next)=>{
  console.log(`putting ${req.params.blogpostid}`);
  let putdata = req.body;
  BlogPost.update(req.params.blogpostid, putdata)
    .then((updatedBlogPost)=>{
      res.status(200);
      res.send(JSON.stringify(updatedBlogPost));
    }).catch((error)=> {
      res.status(404);
      res.end();
    });
});



// delete: Delete post form
router.delete('/post/:blogpostid/delete', (req, res, next)=>{
  let id = req.params.blogpostid;
  PhotoService.delete(req.params.blogpostid)
    .then((blogPost) => {
      console.log(`Deleted post: ${id}`);
      res.status(200);
      res.send(JSON.stringify(blogPost));
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

