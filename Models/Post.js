const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    likes: [{
        name: String,
        id: String
    }],
    comments: [{
        text: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
