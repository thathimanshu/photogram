const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
})
router.post('/signup',wrapAsync(async (req,res)=>{
    try{
        let {username,password} = req.body;
        let newUser = new User({username});

        let registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash('success',"User registered successfully");
            res.redirect('/posts');
        })
        
    } catch(err){
        req.flash("error",err.message);
        res.redirect('/signup');
    }
}));

router.get("/login",(req,res)=>{
    res.render('user/login.ejs')
})

router.post('/login',passport.authenticate('local',{failureRedirect : '/login',failureFlash:true}),wrapAsync(async (req,res)=>{
    req.flash('success',"welcome back");
    res.redirect('/posts');
}))

module.exports = router;