const express = require('express')
const router = express.Router();

const postConstroller  = require('../app/controllers/PostController')


router.get('/:slug',postConstroller.postDetail);
router.post('/',postConstroller.getvalue)



module.exports = router;