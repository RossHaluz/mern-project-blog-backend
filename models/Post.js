const {Schema, model} = require('mongoose');

const PostSchema = new Schema({
    username: {type: String},
    title: {type: String, require: true},
    text: {type: String, require: true},
    imgUrl: {type: String, default: ''},
    views: {type: Number, default: 0},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, {timestamps: true});

const PostModel = model('Post', PostSchema);

module.exports = {
    PostModel
}