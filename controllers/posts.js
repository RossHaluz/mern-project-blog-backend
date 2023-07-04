const { ctrlWrapper } = require("../hellpers/ctrlWrapper");
const { PostModel } = require("../models/Post");
const { authModel } = require("../models/User");
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const { HttpError } = require("../hellpers/HttpError");

const uploadDir = path.join(__dirname, "..", "upload");

const createNewPost = async (req, res) => {
const {id} = req.userId;
const {title, text} = req.body;
const user = await authModel.findById(id);
if(req.file){
    const {path: tempUpload, originalname} = req.file;
    const filename  = `${crypto.randomUUID()}_${originalname}`
    const resultUpload = path.join(uploadDir, filename)
    await fs.rename(tempUpload, resultUpload)
    // const imgUrl = path.join('image', filename)
    const uploadPostWithImage = await PostModel.create({
        username: user.username,
        imgUrl: filename,
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

const getAllPosts = async (__, res) => {
    const posts = await PostModel.find().sort('-createdAt');
    const popularPosts = await PostModel.find().limit(5).sort('-views');
    if(!posts) {
        throw HttpError(400, 'Постів не знайдено:(')
    }

    res.json({
        posts,
        popularPosts
    })
}

const getPost = async (req, res) => {
const {id} = req.params

const post = await PostModel.findByIdAndUpdate(id, {
    $inc: {views: 1}
})

res.json(post)

}

const getPostsUser = async (req, res) => {
const {id} = req.userId;
const user = await authModel.findById(id)
const list = await Promise.all(
    user.posts.map(item => {
        return PostModel.findById(item._id)
    })
)

res.json(list)
}

const delatePost  = async (req, res) => {
    const {id: postId} = req.params;
    const {id} = req.userId

const delateBook = await PostModel.findByIdAndDelete(postId)
if(!delateBook){
throw HttpError(404, "Такого поста не знайдено")
}
await authModel.findByIdAndUpdate(id, {
    $pull: {posts: postId}
})

res.json({
    message: "Пост успішно видалений"
})
}

const updatePost = async (req, res) => {
const {id} = req.params;
const {text, title} = req.body;
const post = await PostModel.findById(id);

if(!post) {
    console.log("Upsss not found");
    throw HttpError(404, "Пост не знайдено")
}

if(req.file) {
    const {path: tempUpload, originalname} = req.file;
    const filename  = `${crypto.randomUUID()}_${originalname}`
    const resultUpload = path.join(uploadDir, filename)
    await fs.rename(tempUpload, resultUpload)
    const updateWithImage = await PostModel.findByIdAndUpdate(id, {
        text,
        title,
        imgUrl: filename
    }, {new: true})

    return res.json(updateWithImage)
}

const updateWithoutImg = await PostModel.findByIdAndUpdate(id, {
    title,
    text,
}, {new: true})

res.json(updateWithoutImg)
}

module.exports = {
    createNewPost: ctrlWrapper(createNewPost),
    getAllPosts: ctrlWrapper(getAllPosts),
    getPost: ctrlWrapper(getPost),
    getPostsUser: ctrlWrapper(getPostsUser),
    delatePost: ctrlWrapper(delatePost),
    updatePost: ctrlWrapper(updatePost)
}