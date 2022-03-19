const User = require('../models/User')
const PostsModel = require('../models/Post')
const CategoryModel = require('../models/Category')

const bcrypt = require('bcrypt')
const { mutipleMongooseToObject } = require('../../util/handleBlockHbs')
const { mongooseToObject } = require('../../util/handleBlockHbs')
const AdminController = {

    index: async (req, res, next) => {
        res.render('admin/adminPage', { layout: 'admin' })
    },
    //load user page GET
    user: async (req, res, next) => {

        try {
            const user = await User.find({})
            if (!user)
                res.send('dont have any user')

            await res.render('admin/adminUsers', {
                users: mutipleMongooseToObject(user),
                layout: 'admin'
            })
        } catch (error) {
            console.log(error)
        }

    },
    //user edit GET
    userEdit: async (req, res, next) => {

       try {
           const user = await User.findOne({_id: req.params.id})
           if(!user)
                return res.status(400).json({ msg: err.message })
           await res.render('admin/adminUserEdit',{user:mongooseToObject(user) ,layout: 'admin'})

       } catch (error) {
            console.log(error)   
       }
   
    },
    //user edit POST
    userEditSm: async (req, res, next) => {
        try {

            const user = await User.findOne({ _id: req.params.id})
            let { role , status} = req.body  
            if(role === '')
                role = user.role
            if(status === '')
                status = user.status

            await User.updateOne({ _id: req.params.id },{
                role: role,
                status: status
            })
        
            res.redirect('/admin/users')
            
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    //delete user delete
    userDelete: async (req, res, next) => {
        try {
           const user = await User.findOne({ _id: req.params.id})
            
           if(user.role === 'admin')
            return res.redirect('/admin/users')
           
           await User.deleteOne({_id: req.params.id})

            res.redirect('/admin/users')
                
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    //////handle blogs //////
    post: async (req, res, next) => {
       
        try {
            const post = await PostsModel.find({}).populate('category')
            if (!post)
                res.send('dont have any post')

            await res.render('admin/adminPosts', {
                posts: mutipleMongooseToObject(post),
                layout: 'admin'
            })
        } catch (error) {
            console.log(error)
        }

    },
    formCreate: async (req, res, next) => {

        const categorys = await CategoryModel.find({})

        res.render('admin/adminCreatePost', { 
            categorys: categorys ? mutipleMongooseToObject(categorys) : '',
            layout: 'admin' })
    },
    createPost: async (req,res,next) => {

        try {

            const { title, content, description, category } = req.body

            const newPost = new PostsModel({

                user: res.locals.lcuser._id,
                title: title.toLowerCase(), 
                content,
                description, 
                thumbnail: (req.file) ? req.file.path.split('\\').slice(4,7).join('/') : 'img/thumbnail-post/defaultimg.jpg',
                category: category

            })

            await newPost.save()
            res.redirect('/admin/posts');
           
        } catch (error) {
            return res.status(500).json({ msg: error.message }) 
        }
    },
    postDelete: async(req,res,next) =>{
        try{
 
            await PostsModel.deleteOne({_id: req.params.id})
 
             res.redirect('/admin/posts')
            
        } catch (error) {
            return res.status(500).json({ msg: error.message })    
        }
    }, 
    ///// get form edit////
    postEdit: async(req , res,next) =>{
        try {   
            const post =await PostsModel.findOne({_id: req.params.id})
            .populate('category')
            if(!post) 
                return res.json('not found')
            const categorys = await CategoryModel.find({})

            await res.render('admin/adminEditPost',{
                post:  mongooseToObject(post),
                categorys: mutipleMongooseToObject(categorys),
                layout: 'admin'
            })
            
        } catch (error) {
            return res.status(500).json({ msg: error.message })    
        }

    },
    postEditSm: async( req , res, next) =>{
        try {
        const post = await PostsModel.findOne({_id: req.params.id})
        let {title , description , content, category} = req.body
        if(title === '')
            title = post.title
        if(description === '')
            description = post.title
        if(content === '')
            content = post.content
        if(category === '')
             category = post.category
        if(req.file)
        {
            var thumbnail = req.file.path.split('\\').slice(5,8).join('/')  
        }else
        {
           var thumbnail = post.thumbnail         
        }
        await PostsModel.updateOne({_id: req.params.id},{
                title,
                description,
                content,
                thumbnail,
                category
        })

        res.redirect('/admin/posts')
        
        } catch (error) {
            return res.status(500).json({ msg: error.message }) 
        }
    },
    formCreateCt: async(req,res) => {
        try {
            await res.render('admin/adminCreateCate',{
                layout: 'admin'
            })
            
        } catch (error) {
            return res.status(500).json({ msg: error.message })    
        }
    },
    CreateCtSm: async  (req,res) =>{
        try {

            const { category } = req.body

            const match =  await CategoryModel.findOne({name: category})
            if(match)
                return res.render('admin/adminCreateCate',{
                    err: 'This category already exists',
                    layout: 'admin'
                })
                
            const newCategory = new CategoryModel({
                name: category
            })
               
            await newCategory.save();
            res.redirect('/admin/categorys')
            
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getCategorys: async(req,res) => {
        try {

            const categorys = await CategoryModel.find({})
            if(!categorys) 
                return res.status(400).json({msg: 'not found'})
            res.render('admin/adminCategorys',{
                layout: 'admin',
                categorys: mutipleMongooseToObject(categorys)
            })
            
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    deleteCategory: async (req,res) => {
        try {
      const blog = await PostsModel.findOne({category: req.params.id})
      if(blog) 
        return res.status(400).json({
          msg: "Can not delete! In this category also exist posts."
        })
      const category = await CategoryModel.findByIdAndDelete(req.params.id)
      if(!category) 
        return res.status(400).json({msg: "Category does not exists."})
      res.redirect('/admin/categorys')
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
    }
}

module.exports = AdminController;