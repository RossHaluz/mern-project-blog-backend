const { HttpError } = require("../hellpers/HttpError");
const { ctrlWrapper } = require("../hellpers/ctrlWrapper");
const { authModel } = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
const {username, password} = req.body;
const user = await authModel.findOne({username});
if(user){
    throw HttpError(400, 'Данний користувач уже зареєстрований')
}
const hashPassword = await bcrypt.hash(password, 10);
const createUser = await authModel.create({
    username,
    password: hashPassword
})
const payload = {
    id: createUser._id
}
const token = await jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '24h'})
const newUser = await authModel.findByIdAndUpdate(createUser._id, {token}, {new: true})

return res.json(newUser)
}

const login = async (req, res) => {
const {username, password} = req.body;
const user = await authModel.findOne({username});
if(!user){
    throw HttpError(400, "Користувача не знайдено")
}
const isMatch = bcrypt.compare(password, user.password)
if(!isMatch){
    throw HttpError(400, "Не валідний пароль або імя користувача")
}
const payload = {
    id: user._id
}
const token = await jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '24h'})
await authModel.findByIdAndUpdate(user._id, {token}, {new: true})

res.json(user)
}

module.exports = {
register: ctrlWrapper(register),
login: ctrlWrapper(login)
}