const {postSchema,commentSchema} = require('./schema.js');
const ExpressError = require('./utils/ExpressError');

module.exports.validatePost = (req,res,next)=>{
    let {error} = postSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(", ");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
}
module.exports.validateComment = (req,res,next)=>{
    let {error} = commentSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el)=>el.message).join(", ");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
}
module.exports.saveRedirectedUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in");
        return res.redirect('/login');
    }
    next();
}