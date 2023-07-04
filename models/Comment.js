const {Schema, model} = require('mongoose');

const CommentSchema = new Schema({
    comment: {type: String, require: true},
    user: {type: String, require: true},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true});

const CommentModel = model('Comment', CommentSchema);

module.exports = {
    CommentModel
}