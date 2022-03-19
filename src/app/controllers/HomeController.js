const PostModel = require('../models/Post')
const CategoryModel = require('../models/Category')
const  CommentModel = require('../models/Comment')

var fs = require('fs');

const { mutipleMongooseToObject } = require('../../util/handleBlockHbs')
const { mongooseToObject } = require('../../util/handleBlockHbs')

const path = require('path');

const HomeController = {

    index: async (req, res, next) => {
        try {

            const post = await PostModel.find({}).sort({
                createdAt: -1
            }).populate('user')
            const category = await CategoryModel.find({})
            
            const mostview = await PostModel.find({}).sort({views: -1}).limit(5)
            await res.render('home', {
                posts: mutipleMongooseToObject(post),
                categorys: mutipleMongooseToObject(category),
                postmostviews: mutipleMongooseToObject(mostview),
            })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    searchPage: async (req, res, next) => {

        try {
            res.render('search/searchPage')

        } catch (error) {
            return res.status(500).json({ msg: error.message })

        }
    },
    
}

module.exports = HomeController;