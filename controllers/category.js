const { HttpError } = require("../hellpers/HttpError");
const { ctrlWrapper } = require("../hellpers/ctrlWrapper");
const { PostModel } = require("../models/Post");

const getCategoryPosts = async (req, res) => {
const {category} = req.params;
const posts = await PostModel.find({category})
if(!posts) {
    throw HttpError(404, "Постів не знайдено")
}

res.json(posts)
}

module.exports = {
    getCategoryPosts: ctrlWrapper(getCategoryPosts)
}