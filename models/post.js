const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');
const { required, number } = require('joi');
const postSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    imageUrl:{
        type:String
    },
    likes:{
        type:Number,
        default:0
    },
    caption:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    comments:[
        {
            type:Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

postSchema.post("findOneAndDelete",async(post)=>{
    if(post){
        await Comment.deleteMany({_id:{$in:post.comments}});
    }
});


const Post = mongoose.model("Post",postSchema);
module.exports = Post;
