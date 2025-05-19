const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        unique:true,
        required:true
    },
    mail:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        unique:true,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:false
    },
    gallery:{
        type:Array,
        default:[]
    },
    membershipType: {
        type: String,
        enum: ['vip', 'regular', 'vvip'],
        default: 'regular'
    },
    membershipPlan: {
        type: String,
        enum: ['weekly', 'two-weeks', 'monthly', 'regular', 'vip', 'vvip'],
        default: 'regular',
    },
    latitude: {
        type: Number,
        required: false, // Optional field for geolocation
    },
    longitude: {
        type: Number,
        required: false, // Optional field for geolocation
    },
},{timestamps:true})

const userModel = mongoose.model("User", userSchema)
module.exports = userModel