const express = require('express')
const router = express.Router();

const categoryConstroller  = require('../app/controllers/CategoryController')

router.get('/:slug/:id', categoryConstroller.getindex);


module.exports = router;