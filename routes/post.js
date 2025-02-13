const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync');
const Post = require('../models/post');
const User = require('../models/user');
const {validatePost} = require('../middleware.js');
const ExpressError = require('../utils/ExpressError');


//like post
router.post('/like/:id',wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let post = await Post.findById(id);
    post.likes = post.likes + 1;
    await post.save();

    let user = await User.findById(req.user._id);
    user.liked.push(id);
    await user.save();
    res.json({
        action:"like"
    });
}))
//unlike post
router.post('/unlike/:id',wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let post = await Post.findById(id);
    post.likes = post.likes - 1;
    await post.save();

    let user = await User.findById(req.user._id);
    user.liked.remove(id);
    await user.save();
    res.json({
        action:"unlike"
    });
}))

// index route
router.get("/", async (req, res) => {
    let allPosts = await Post.find({})
                                .sort({ createdAt: -1 })
                                .populate('user','username profilePicture');
    let suggestionList = await User.find({ 
        username: { $ne: req.user.username },
        _id: { $nin: req.user.following }
    }).limit(5);
    res.render("./posts/index.ejs", { posts: allPosts , suggestionList});
});

//new route
router.get("/new",(req,res)=>{
    res.render("./posts/new.ejs",{imageUrl : req.query.imageUrl});
})

//create route
router.post("/",validatePost,wrapAsync(async(req,res)=>{
    let postData = req.body.post;
    postData.user = req.user._id;
    const newPost = new Post(postData);
    await newPost.save();

    const user = await await User.findById(req.user._id);
    user.posts.push(newPost._id)
    await user.save();

    req.flash('success','new Post created');
    res.redirect("/posts");
}))

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const post = await Post.findById(id).populate('comments');
    if(post==null) {
        req.flash('error',"Post not found");
        return res.redirect('/posts');
    }
    res.render("./posts/show.ejs",{post});
}))

//edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let post = await Post.findById(id);
    if(post==null){
        req.flash('error','Post not found!');
        return res.redirect('/posts');
    }
    res.render("./posts/edit.ejs",{post});
}))

//delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success',"post deleted");
    res.redirect("/posts");
}))



module.exports = router;