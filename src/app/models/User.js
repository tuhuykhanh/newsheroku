const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String, 
        required: true,
        trim: true,
        minlength: 2},
    email: {type: String, 
        unique: true,
         required: true, 
         trim: true},
    role: {type: String, 
        default: 'customer'},
    password: {type: String, 
        required: true, 
        trim: true, 
        minlength: 6},
    avatar: {type: String,
        trim: true,
    default: 'uploads/avatar-1644396883170-37070774.jpg'},
    address:{
        type: String,
        trim: true,
        default: 'none',
    },
    status: {
        type: String,
        trim: true,
        default: 'normal'
    }
},{
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
})

module.exports = mongoose.model('users', UserSchema)