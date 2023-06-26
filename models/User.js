const {Schema, model} = require('mongoose');

const authSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    token: {
        type: String,
        require: true
    },
    posts: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }
})

const authModel = model('User', authSchema)

module.exports = {
    authModel
}