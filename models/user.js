const { ref } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    username:{
        type:String,
        required:true
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
    ]
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User",userSchema);
module.exports = User;
