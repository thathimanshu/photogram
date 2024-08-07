const { ref } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    name:{
        type:String,
    },
    profilePicture:{
        type:String,
        default:"https://i.pinimg.com/736x/18/b9/ff/18b9ffb2a8a791d50213a9d595c4dd52.jpg"
    },
    bio:{
        type:String,
    },
    followers:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    posts:[
        {
            type:Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    liked:[
        {
            type:Schema.Types.ObjectId,
            ref:"Post"
        }
    ]
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User",userSchema);
module.exports = User;
