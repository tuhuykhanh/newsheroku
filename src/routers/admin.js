const express = require('express')
const router = express.Router();
const checklogout = require('../app/middlewares/CheckLogOut')
const adminConstroller = require('../app/controllers/AdminController')
const commentController = require('../app/controllers/CommentController')

const path = require('path');
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../public/img/thumbnail-post'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg') 
    }
  })
const upload = multer({ storage: storage })


router.get('/comments:id',checklogout.authAdmin, commentController.getcomments)

router.delete('/comment/delete:id',checklogout.authAdmin, commentController.delcomment)

router.delete('/post/delete:id',checklogout.authAdmin, adminConstroller.postDelete)

router.delete('/user/delete:id',checklogout.authAdmin, adminConstroller.userDelete)

router.put('/postedit:id',upload.single('thumbnail'),checklogout.authAdmin, adminConstroller.postEditSm)

router.get('/postedit:id',checklogout.authAdmin, adminConstroller.postEdit)

router.get('/edit:id',checklogout.authAdmin, adminConstroller.userEdit)
//edit user
router.post('/edit:id',checklogout.authAdmin, adminConstroller.userEditSm)

router.get('/users',checklogout.authAdmin, adminConstroller.user)

////create posts
router.get('/create',checklogout.authAdmin, adminConstroller.formCreate)

router.post('/createct',checklogout.authAdmin, adminConstroller.CreateCtSm)

router.get('/createct',checklogout.authAdmin, adminConstroller.formCreateCt)

router.get('/categorys',checklogout.authAdmin, adminConstroller.getCategorys)

router.delete('/category/delete:id',checklogout.authAdmin, adminConstroller.deleteCategory)

router.post('/create',upload.single('thumbnail'),checklogout.authAdmin, adminConstroller.createPost)

router.get('/posts',checklogout.authAdmin, adminConstroller.post)

router.get('/',checklogout.requiresLogin,checklogout.authAdmin, adminConstroller.index)



module.exports = router;
