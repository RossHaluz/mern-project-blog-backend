const { register, login } = require("../controllers/auth");
const router = require("express").Router();

//Register 
router.post('/register', register)

//Login
router.post('/login', login)

//Get me


module.exports = router