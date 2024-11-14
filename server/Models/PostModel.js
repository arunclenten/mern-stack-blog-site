const mongoose =require('mongoose')


const PostSchema =new mongoose.Schema({
    title:String,
    description:String,
    file:String,
    email:String,
    createdAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false } 
})

const PostModel =mongoose.model('posts',PostSchema)

module.exports =PostModel;