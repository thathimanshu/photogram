if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}    
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const Posts = require('./models/post');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const wrapAsync = require('./utils/wrapAsync');
const {postSchema,commentSchema} = require('./schema.js');
const Post = require('./models/post');
const Comment = require('./models/comment');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');
const userRouter = require('./routes/user');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const MongoStore = require('connect-mongo');
const {isLoggedin} = require('./middleware.js');
//const mongoose_url= 'mongodb://127.0.0.1:27017/photogram';
const dbUrl = process.env.ATLASTDB_URL;

require('dotenv').config()
//middleware setup
app.use(express.static(path.join(__dirname,'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));

//view engine setup
app.engine('ejs',ejsMate);
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");

const sessionStore = MongoStore.create({
    mongoUrl: dbUrl,
    collectionName: 'sessions',
});

const sessionOption = {
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized :true,
    store:sessionStore,
    cookie:{
        expires: Date.now() + 7*24*3600000,
        maxAge:7*24*3600000,
        httpOnly:true
    }
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});
//mongodb connection
(async function main(){
    await mongoose.connect(dbUrl);
})();

app.listen(8080,()=>{
    console.log("App is Listening on port 8080");
});


//root path
app.get("/",(req,res)=>{
    res.redirect('/posts');
});

app.use('/',userRouter);
app.use('/posts',isLoggedin,postRouter);
app.use('/posts/:id/comments',isLoggedin,commentRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})


app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong"} = err;
    res.status(statusCode).render("error.ejs",{err});
    //res.status(statusCode).send(message);
});
