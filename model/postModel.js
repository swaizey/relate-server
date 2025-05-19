const mongoose = require('mongoose')


const postSchema = mongoose.Schema({
    msg:{
        type:String,
    },
    pic:{
        type:String,
    },
    senderId:{
        type: mongoose.Schema.Types.ObjectId, // Reference to another schema
        ref: 'User', // Assuming you have a User model
        required: true
    },
    isPending:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

const postModel = mongoose.model("Post", postSchema)
module.exports = postModel