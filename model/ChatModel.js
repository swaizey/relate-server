const mongoose = require("mongoose");


const chat = mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message:String,
    username:String
},{timestamps:true})

const chatSchema = mongoose.Schema({
    members:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    chat:[chat]
},{timestamps:true})

const Chat = mongoose.model('Chat',chatSchema)
module.exports = Chat