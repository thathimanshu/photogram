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
    profilePicture:{
        type:String,
        default:"https://w7.pngwing.com/pngs/269/467/png-transparent-desktop-computer-font-placeholder-white-computer-computer-wallpaper-thumbnail.png"
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
