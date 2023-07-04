const { HttpError } = require("../hellpers/HttpError");
const { ctrlWrapper } = require("../hellpers/ctrlWrapper");
const { CommentModel } = require("../models/Comment");
const { PostModel } = require("../models/Post");


const createNewComment = async (req, res) => {
    const {id} = req.params;
    const {comment} = req.body;
    if(!comment) {
        throw HttpError(400, 'Коментар не може бути пустим')
    }
    
    const newComment = await CommentModel.create({comment});
    await PostModel.findByIdAndUpdate(id, {
        $push: {comments: newComment._id}
    })

    res.json(newComment)
}

const getAllComments = async (req, res) =>{
    const {postId} = req.params;
    const post = await PostModel.findById(postId);
    const list = await Promise.all(
        post.comments.map(item => {
            return CommentModel.findById(item)
        })
    )

    res.json(list)
}

module.exports = {
    createNewComment: ctrlWrapper(createNewComment),
    getAllComments: ctrlWrapper(getAllComments)
}