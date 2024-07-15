const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');
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
