const { register, login, getCurrentUser, logout } = require("../controllers/auth");
const checkAuth = require("../midelware/checkAuth");
const router = require("express").Router();

//Register 
router.post('/register', register)

//Login
router.post('/login', login)

//Current user
router.get('/current-user', checkAuth, getCurrentUser)

//Logout
router.post('/logout', checkAuth, logout)


module.exports = router