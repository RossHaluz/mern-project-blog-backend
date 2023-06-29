const { ctrlWrapper } = require("../hellpers/ctrlWrapper");
const { PostModel } = require("../models/Post");
const { authModel } = require("../models/User");
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

const uploadDir = path.join(__dirname, "..", "upload");

const createNewPost = async (req, res) => {
    console.log(req.file);
const {id} = req.userId;
const user = await authModel.findById(id);
const {title, text} = req.body;
if(req.file){
    console.log(reg.file);
    const {path: tempUpload, originalname} = req.file;
    const filename  = `${crypto.randomUUID()}_${originalname}`
    const resultUpload = path.join(uploadDir, filename)
    await fs.rename(tempUpload, resultUpload)
    const imgUrl = path.join('image', filename)
    const uploadPostWithImage = await PostModel.create({
        username: user.username,
        imgUrl,
        title,
        text,
        author: id
    })
    await authModel.findByIdAndUpdate(id, {
        $push: {posts: uploadPostWithImage}
    }, {new: true})

    return res.json(uploadPostWithImage)
}

const uploadPostWithoutImg = await PostModel.create({
    username: user.username,
    title,
    text,
    imgUrl: '',
    author: id
})
await authModel.findByIdAndUpdate(id, {
    $push: {posts: uploadPostWithoutImg}
}, {new: true})

res.json(uploadPostWithoutImg)
}

module.exports = {
    createNewPost: ctrlWrapper(createNewPost)
}