const { createNewPost, getAllPosts, getPost, getPostsUser, delatePost, updatePost, setFavoritePost, getFaviritePosts } = require('../controllers/posts');
const checkAuth = require('../midelware/checkAuth');
const upload = require('../midelware/upload');
const router = require('express').Router();

//Get all posts
router.get("/", getAllPosts)

//Get post
router.get('/:id', getPost)

//Get posts user
router.get('/user/posts', checkAuth, getPostsUser)

// Add post
router.post('/', checkAuth, upload.single('image'), createNewPost)

//Delate post
router.delete('/:id', checkAuth, delatePost)

//Update post 
router.put('/:id', checkAuth, upload.single('image'), updatePost)

//Add post to favorite
router.post('/favorite/:postId', checkAuth,  setFavoritePost);

//Get favorite posts 
router.get('/favorite', checkAuth, getFaviritePosts)

module.exports = router;