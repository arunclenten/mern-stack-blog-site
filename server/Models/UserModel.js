const mongoose =require('mongoose')


const Userschema =new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    createdAt: { type: Date, default: Date.now } ,
    deleted: { type: Boolean, default: false } 
})

const UserModel =mongoose.model('users',Userschema)

module.exports =UserModel;