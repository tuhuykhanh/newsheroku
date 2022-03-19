
const CommentModel = require('../models/Comment')
const UserModel = require('../models/User')
const PostModel = require('../models/Post')

const { mutipleMongooseToObject } = require('../../util/handleBlockHbs')
const { mongooseToObject } = require('../../util/handleBlockHbs')

const path = require('path');

const CommentController = {

    savecomment: async (req,res) =>{
        try {

           const { email , slug , comment } = req.body
            
           const user =await UserModel.findOne({email: email})

           const post =await PostModel.findOne({slug: slug})

           await PostModel.updateOne({slug: slug},{
                totalcmt: post.totalcmt + 1
           })

           const newComment = new CommentModel({
            iduser: user._id,
            idpost: post._id,
            content: comment
           })
           await newComment.save();


        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getcomments: async (req,res) =>{
        try {
            const postid = req.params.id
            console.log(postid)
            const post = await PostModel.findOne({_id: postid})
         
            const comments = await CommentModel.find({idpost: postid}).populate('iduser')
            
            res.render('admin/admincomments',{
                post: mongooseToObject(post),
                comments: mutipleMongooseToObject(comments),
                layout: 'admin'
            })


        } catch (error) {
            return res.status(500).json({ msg: error.message })
            
        }
    },
    ///admin delete ////
    delcomment: async (req,res) => {
        try {
                const cmtid = req.params.id
                await CommentModel.deleteOne({_id: cmtid})
                res.redirect('back')   

        } catch (error) {

            return res.status(500).json({ msg: error.message })
            
        }
    },
    ///user delete ///
    deletecomment: async (req,res) => {
        try {

            const id = req.params.id
            await CommentModel.deleteOne({_id: id})

        } catch (error) {
            return res.status(500).json({ msg: error.message })
            
        }
    }
}
module.exports = CommentController;