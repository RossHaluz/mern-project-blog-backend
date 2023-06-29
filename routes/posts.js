const { createNewPost } = require('../controllers/posts');
const checkAuth = require('../midelware/checkAuth');
const upload = require('../midelware/upload');
const router = require('express').Router();

router.post('/', checkAuth, upload.single('image'), createNewPost)

module.exports = router;