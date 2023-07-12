const { getCategoryPosts } = require('../controllers/category');
const router = require('express').Router();

router.get('/:category', getCategoryPosts)

module.exports = router;