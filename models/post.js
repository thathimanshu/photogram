const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String
    },
    caption:{
        type:String
    },
    createdAt:{
        type:Date
    }
});

const Post = mongoose.model("Post",postSchema);
module.exports = Post;
