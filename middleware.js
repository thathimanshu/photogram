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
