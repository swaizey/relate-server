const mongoose = require('mongoose');
const Chat = require("../model/ChatModel");


 const sendMsg = async(req, res)=>{
    const {members, chat} = await req.body

    const rearanged = [members[1],members[0]]
    const cchat = await Chat.findOne({$or:[{members:members},{members:rearanged}]})
    if(!cchat){
        const newChat = await Chat.create({members,chat:chat})
        try {
            newChat.save()
            res.status(200).json(newChat)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        await cchat.chat.push(chat)
        try {
            cchat.save()
            res.status(200).json(cchat)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}
 const getSingleChat = async(req, res)=>{
    // const {members} = await req.params
    
    const {member1, member2} = req.params
    const members = [member1, member2]
    const rearanged = [member2, member1]
    const chat = await Chat.findOne({$or:[{members:members},{members:rearanged}]}).populate('members', 'username profilePic'); // Populate username and profilePic for members

        try {
            res.status(200).json(chat)
        } catch (error) {
            res.status(500).json(error)
    }
}

 const chats = async(req,res)=>{
    const {id} = req.params
    const conv = new mongoose.Types.ObjectId(id)
    const chats = await Chat.find({members:id}).populate('members', 'username profilePic'); // Populate username and profilePic for members
    if(chats){
        res.status(200).json(chats)
    }else{
        res.status(401).json('No chats')
    }
}
module.exports = {sendMsg, getSingleChat, chats}