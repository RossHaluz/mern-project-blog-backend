const { ctrlWrapper } = require("../hellpers/ctrlWrapper");
const { PostModel } = require("../models/Post");
const { authModel } = require("../models/User");
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const { HttpError } = require("../hellpers/HttpError");
const { post } = require("../routes/posts");

const uploadDir = path.join(__dirname, "..", "upload");

const createNewPost = async (req, res) => {
const {id} = req.userId;
const {title, text, category} = req.body;
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
        category,
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
    category,
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
const {id} = req.params;

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

const setFavoritePost = async (req, res) => {
    const {id} = req.userId;
    const {postId} = req.params;

    const post = await PostModel.findOne({favorites: id, _id: postId});
    if(post){
        throw HttpError(409, "Пост вже доданий до збережениз")
    }
    const updatePost = await PostModel.findByIdAndUpdate(postId, {
        _id: postId,
        $push: {favorites: id}
    }, {new: true})

    if(!updatePost){
        throw HttpError(400, "Щось пішло не так...")
    }
    
    res.json(updatePost)
}

const getFaviritePosts = async (req, res) => {
const {id} = req.userId;
const posts = await PostModel.find({favorites: id});
if(!posts) {
    throw HttpError(404, "Постів не знайдено")
}

res.json(posts)
}

const removeFavoritePost = async (req, res) => {
    const {id} = req.userId;
    const {postId} = req.params;

const removeFavorite = await PostModel.findByIdAndUpdate(postId, {
        $pull: {favorites: id}
    })
res.json({
    data: removeFavorite,
    message: "Success remove from favorite"
})
}

const getCategoryPosts = async (req, res) => {
    const {category} = req.params;
    const posts = await PostModel.find({category})
    if(!posts) {
        throw HttpError(404, "Постів не знайдено")
    }
    
    res.json(posts)
    }

    const getSearchCategory = async (req, res) => {
        const {query} = req.query;
        const {category} = req.params;
        if(!query){
            const posts =await PostModel.find({category})
            return res.json(posts)
        }

        const allPosts = await PostModel.find()

        const filterPosts = allPosts.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
        if(!filterPosts){
            throw HttpError(404, "Постів не знайдено")
        }

        res.json(filterPosts)
    }

    const getSearchPosts = async (req, res) => {
        const {query} = req.query;
        if(!query) {
            const posts = await PostModel.find();

            return res.json(posts)
        }

        const serchPosts = await PostModel.find({title: query});
        if(!serchPosts){
            throw HttpError(404, "Постів не знайдено")
        }

        res.json(serchPosts)
    }

module.exports = {
    createNewPost: ctrlWrapper(createNewPost),
    getAllPosts: ctrlWrapper(getAllPosts),
    getPost: ctrlWrapper(getPost),
    getPostsUser: ctrlWrapper(getPostsUser),
    delatePost: ctrlWrapper(delatePost),
    updatePost: ctrlWrapper(updatePost),
    setFavoritePost: ctrlWrapper(setFavoritePost),
    getFaviritePosts: ctrlWrapper(getFaviritePosts),
    removeFavoritePost: ctrlWrapper(removeFavoritePost),
    getCategoryPosts: ctrlWrapper(getCategoryPosts),
    getSearchCategory: ctrlWrapper(getSearchCategory),
    getSearchPosts: ctrlWrapper(getSearchPosts)
}