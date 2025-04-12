// blogController.js

const multer = require('multer');
const BlogPost = require('../models/blogPostModel');


class BlogService {

  static list(){
    return BlogPost.find({})
      .then((blogPosts)=>{
        return blogPosts;
      });
  }

  static find(id){
    return BlogPost.findById(id)
      .then((blogPost)=>{
        return blogPost;
      });
  }

  static create(obj){
    const blogPost = new BlogPost(obj);
    return blogPost.save();
  }

  static update(id, data){
    return BlogPost.findById(id)
     .then((blogPost)=>{
       blogPost.set(data);
       blogPost.save();
       return blogPost;
     });
  }

  static delete(id){
    return BlogPost.deleteOne({_id: id})
      .then((obj)=>{
        //removed
        return obj;
      })
  }
}

module.exports.BlogService = BlogService;

