const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const {saveRedirectedUrl,isLoggedin} = require('../middleware.js');
router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
})
router.post('/signup',wrapAsync(async (req,res)=>{
    try{
        let {username,password,profilePicture,bio} = req.body;
        let newUser = new User({username,profilePicture,bio});

        let registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash('success',"User registered successfully");
            return res.redirect('/posts');
        });
        
    } catch(err){
        req.flash("error",err.message);
        res.redirect('/signup');
    }
}));


router.get("/login",(req,res)=>{
    res.render('user/login.ejs')
})

router.post('/login',saveRedirectedUrl,passport.authenticate('local',{failureRedirect : '/login',failureFlash:true}),wrapAsync(async (req,res)=>{
    req.flash('success',"welcome back");
    let redirecturl = res.locals.redirectUrl || '/posts';
    res.redirect(redirecturl);
}))
router.get("/logout",wrapAsync(async (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success",'Logged Out!');
        res.redirect('/posts'); 
    })
}))
router.get('/accounts/edit',(req,res)=>{
    res.render('user/edit.ejs');
})

router.get('/u/:username',isLoggedin,wrapAsync(async(req,res)=>{
    let {username} = req.params;
    let user = await User.findOne({username:username}).populate('posts');
    if(!user){
        req.flash("error","User doesnt exist");
        return res.redirect('/posts');
    }
    let currUser = await User.findById(req.user._id);
    if(currUser._id.toString() == user._id.toString()){
        return res.render('user/showMyProfile.ejs',{user});
    }
    let isFollowing = currUser.following.includes(user._id);
    res.render('user/showProfile.ejs',{user,isFollowing});
}))

router.post('/follow/:username',wrapAsync(async (req,res)=>{
    let currUser = await User.findById(req.user._id);
    let toFollow = await User.findOne({username:req.params.username});

    if(!toFollow || !currUser){
        req.flash('error',"User does not exist");
        return res.redirect('/posts');
    }
    if(currUser.following.includes(toFollow._id)){
        req.flash('error',"User already followed");
        return  res.redirect(`/u/${req.params.username}`);
    }
    currUser.following.push(toFollow._id);
    toFollow.followers.push(currUser._id);
    await currUser.save();
    await toFollow.save();
    res.json({
        action: 'follow',
    });
}))

router.post('/unfollow/:username',wrapAsync(async (req,res)=>{
    let currUser = await User.findById(req.user._id);
    let toFollow = await User.findOne({username:req.params.username});

    if(!toFollow || !currUser){
        req.flash('error',"User does not exist");
        return res.redirect('/posts');
    }

    if(!currUser.following.includes(toFollow._id)){
        req.flash('error',"User not followed");
        return  res.redirect(`/u/${req.params.username}`);
    }

    currUser.following = currUser.following.filter(id => id.toString() !== toFollow._id.toString());
    toFollow.followers = toFollow.followers.filter(id => id.toString() !== currUser._id.toString());

    await currUser.save();
    await toFollow.save();
    res.json({
        action: 'unfollow',
    });
}))
module.exports = router;