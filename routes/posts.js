const { createNewPost, getAllPosts, getPost, getPostsUser, delatePost, updatePost, setFavoritePost, removeFavoritePost, getFaviritePosts, getCategoryPosts, getSearchCategory, getSearchPosts } = require('../controllers/posts');
const checkAuth = require('../midelware/checkAuth');
const upload = require('../midelware/upload');
const router = require('express').Router();

//Get all posts
router.get("/", getAllPosts);

//Search posts
router.get('/search-posts', getSearchPosts);

//Category search
router.get('/category-search/:category', getSearchCategory);

//Get posts from category
router.get('/category/:category', getCategoryPosts);

//Get favorite posts 
router.get('/favorite', checkAuth, getFaviritePosts);

//Get post
router.get('/:id', getPost);

//Get posts user
router.get('/user/posts', checkAuth, getPostsUser);

// Add post
router.post('/', checkAuth, upload.single('image'), createNewPost);

//Delate post
router.delete('/:id', checkAuth, delatePost);

//Update post 
router.put('/:id', checkAuth, upload.single('image'), updatePost);

//Add post to favorite
router.post('/favorite/:postId', checkAuth,  setFavoritePost);

//Remove post from favorite
router.post('/favorite-remove/:postId', checkAuth, removeFavoritePost);


module.exports = router;