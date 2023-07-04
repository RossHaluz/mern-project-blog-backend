const { createNewComment, getAllComments } = require('../controllers/comments');
const checkAuth = require('../midelware/checkAuth');
const router = require('express').Router();

//Get all comments
router.get('/:postId', getAllComments)

//Create a new post
router.post('/:id', checkAuth, createNewComment);

module.exports = router;