const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')

const CommentSchema = new Schema({

    iduser: { 
       type: mongoose.Types.ObjectId, 
       ref: 'users', 
       require: true},
    idpost: {
        type: mongoose.Types.ObjectId,
        ref: 'posts', 
        require: true,
    },
    content: { 
        type: String, 
        required: true },
    time: {
        type: String,
        default: moment(Date.now()).format('LT')
    }
})

module.exports = mongoose.model('comments',CommentSchema)