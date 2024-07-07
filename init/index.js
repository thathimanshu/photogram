const mongoose = require('mongoose');
const initData = require('./data.js');
const Post = require('../models/post.js');
const mongoose_url = 'mongodb://127.0.0.1:27017/photogram'

async function main(){
    await mongoose.connect(mongoose_url);
}
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})

const initDB = async ()=>{
    await Post.deleteMany({});
    const res = await Post.insertMany(initData.data);
    console.log(res);
    console.log("Data was Initialised");
}
initDB();