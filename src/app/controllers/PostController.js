const PostModel = require('../models/Post')
const CategoryModel = require('../models/Category')
const CommentModel = require('../models/Comment')

const { mutipleMongooseToObject } = require('../../util/handleBlockHbs')
const { mongooseToObject } = require('../../util/handleBlockHbs')

const path = require('path');

const PostController = {

    postDetail: async (req, res, next) => {

        try {
            const post = await PostModel.findOne({ slug: req.params.slug })
                .populate('user category')

            await PostModel.findOneAndUpdate({ slug: req.params.slug }, { views: post.views + 1 })

            const postscates = await PostModel.find({ category: post.category })

            const comments = await CommentModel.find({ idpost: post._id }).populate('iduser idpost')

            const posts = await PostModel.find({}).sort({views: -1}).limit(5)

            await res.render('post/postDetail', {
                post: mongooseToObject(post),
                postscates: mutipleMongooseToObject(postscates),
                comments: mutipleMongooseToObject(comments),
                posts: mutipleMongooseToObject(posts),
            })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }

    },
    getvalue: async (req, res, next) => {
        try {

            let payload = req.body.payload.trim();
            let result = await PostModel.find({ title: { $regex: new RegExp('^' + payload + '.*') } }).exec();
            result = result.slice(0, 10);
            res.send({ payload: result })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    }

}

module.exports = PostController;