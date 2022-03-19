const PostModel = require('../models/Post')
const CategoryModel = require('../models/Category')

const { mutipleMongooseToObject } = require('../../util/handleBlockHbs')
const { mongooseToObject } = require('../../util/handleBlockHbs')

const path = require('path');

const CategoryController = {

    getindex: async (req,res)=>{
        try {

            const idCate = req.params.id
            const posts  = await PostModel.find({category : idCate}).populate('user')
            const categorys = await CategoryModel.find({})
            if(!posts)
                return res.status(400).json({msg:'not found'})
            res.render('category/cate',{
                posts: mutipleMongooseToObject(posts),
                categorys: mutipleMongooseToObject(categorys)
            })
                   
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    }
}
module.exports = CategoryController;