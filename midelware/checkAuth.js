const { HttpError } = require("../hellpers/HttpError");
const jwt = require("jsonwebtoken");

const checkAuth = async (req, res, next) => {
const authHeader = req.headers.authorization || ''
if(!authHeader) {
    next(HttpError(401, "Не авторизований"))
}
const [bearer, token] = authHeader.split(" ", 2);
if(bearer !== "Bearer") {
    next(HttpError(401, "Не авторизований"))
}
jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if(err){
        next(HttpError(401, "Не авторизований"))
    }
    req.userId = decoded

    next()
})
}

module.exports = checkAuth;