const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content : {
        type:String,
        required:true,
        trim:true,
        maxlength:150
    },
    author :{
        type:String,
        default:"batman"
    },
    createdAt:{
        type:Date,
        default: Date.now()
    }
    
});

const Comment = mongoose.model("Comment",commentSchema);
module.exports = Comment;
