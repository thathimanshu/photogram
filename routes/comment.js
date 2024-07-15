const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync');
const Post = require('../models/post');
const Comment = require('../models/comment');
const {validateComment} = require('../middleware.js');


// create route
router.post("/",validateComment,wrapAsync(async(req,res)=>{
    let post = await Post.findById(req.params.id);
    let newComment = new Comment(req.body.comment);
    if (!post.comments) {
        post.comments = [];
    }
    post.comments.push(newComment);
    await newComment.save();
    await post.save();
    req.flash('success','comment added');
    res.redirect(`/posts/${req.params.id}`);
}))

//delete route

router.delete("/:commentId",wrapAsync(async (req,res)=>{
   
    console.log("delete route");
    let {id,commentId} = req.params;

    await Post.findByIdAndUpdate(id,{$pull:{comments:commentId}});
    await Comment.findByIdAndDelete(commentId);
    
    req.flash('success','comment deleted!');
    res.redirect(`/posts/${id}`);
}))


module.exports = router;
