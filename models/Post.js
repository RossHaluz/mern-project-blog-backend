const {Schema, model} = require('mongoose');

const PostSchema = new Schema({
    username: {type: String},
    title: {type: String, require: true},
    text: {type: String, require: true},
    imgUrl: {type: String, default: ''},
    views: {type: Number, default: 0},
    favorites: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "User",
    },
    category: {
        type: String,
        enum: ['JavaScript', "React.js", "Node.js", "MongoDB"],
        require: true
    },
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, {timestamps: true});

const PostModel = model('Post', PostSchema);

module.exports = {
    PostModel
}