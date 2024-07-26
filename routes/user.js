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
        let {username,password,profilePicture} = req.body;
        let newUser = new User({username,profilePicture});

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
    let user = await User.findOne({username:username});
    if(!user){
        req.flash("error","User doesnt exist");
        return res.redirect('/posts');
    }
    res.render('user/showProfile.ejs',{user});
}))
module.exports = router;