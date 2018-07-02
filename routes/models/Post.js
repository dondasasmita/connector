const mongoose = require('mongoose')
const Schema = mongoose.Schema

//create Schema for post
const PostSchema = new Schema({
    //connect all posts with a user
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        text: {
            type: String,
            required: true
        },
        username: {
            type: String
        },
        avatar: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
})

module.exports = Post = mongoose.model('post', PostSchema)