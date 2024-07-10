const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const Posts = require('./models/post');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const wrapAsync = require('./utils/wrapAsync');
const postSchema = require('./schema.js');
const Post = require('./models/post');

const mongoose_url= 'mongodb://127.0.0.1:27017/photogram';

//middleware setup
app.use(express.static(path.join(__dirname,'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));

//view engine setup
app.engine('ejs',ejsMate);
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");

//mongodb connection
(async function main(){
    await mongoose.connect(mongoose_url);
})();

app.listen(8080,()=>{
    console.log("App is Listening on port 8080");
});

const validatePost = (req,res,next)=>{
    let {error} = postSchema.validatePost(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(", ");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
}

//root path
app.get("/",(req,res)=>{
    res.send("I am gROOT");
});

//index route
app.get("/posts",async (req,res)=>{
    const allPosts = await Posts.find({});
    res.render("./posts/index.ejs",{posts:allPosts});
})

//new route
app.get("/posts/new",(req,res)=>{
    res.render("./posts/new.ejs");
})

//create route
app.post("/posts",wrapAsync(async(req,res)=>{
    const newPost = new Post(req.body.post);
    await newPost.save();
    res.redirect("/posts");
}))

//show route
app.get("/posts/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const post = await Posts.findById(id);
    if(post==null) throw new ExpressError(404,"User not found");
    res.render("./posts/show.ejs",{post});
}))

//edit route
app.get("/posts/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let post = await Posts.findById(id);
    if(post==null) throw new ExpressError(404,"Post not found");
    res.render("./posts/edit.ejs",{post});
}))

//delete route
app.delete("/posts/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Posts.findByIdAndDelete(id);
    res.redirect("/posts");
}))

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong"} = err;
    res.status(statusCode).render("error.ejs",{err});
    //res.status(statusCode).send(message);
});