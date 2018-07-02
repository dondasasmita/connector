const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

//Load input validation
const validatePostInput = require('../../validation/post')
const validateCommentInput = require('../../validation/comment')

// load models
const Post = require('../models/Post')
const Profile = require('../models/Profile')
const User = require('../models/User')

/*
@route   GET api/posts/test
@desc    Tests post route
@access  Public
*/ 
router.get('/test', (req, res) => res.json({
    msg: "Posts Works"
}))

/*
@route   GET api/posts
@desc    Get all posts 
@access  Public
*/ 
router.get('/', (req, res) => {
    Post.find()
    .sort({date: -1})
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(404).json({post: 'No posts found'}))
})

/*
@route   GET api/posts/:id
@desc    Get posts by post id
@access  Public
*/ 
router.get('/:id', (req, res) => {
    Post.findOne({_id: req.params.id})
    .then(post => res.status(200).json(post))
    .catch(err => res.status(404).json({post: 'No post found'}))
})

/*
@route   POST api/posts
@desc    Create a post
@access  Private
*/ 
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validatePostInput(req.body)
    //check validation
    if (!isValid) {
        // if request is not valid, return response with status 400
        return res.status(400).json(errors)
    }
    // Get all fields and store in newPost object
    const newPost = new Post({
        user: req.user.id,
        username: req.body.username,
        avatar: req.body.avatar,
        text: req.body.text,
        date: req.body.date
    })
    newPost.save().then(post => res.status(200).json(post))
})

/*
@route   DELETE api/posts/:post_id
@desc    Delete post by postID 
@access  Private
*/ 
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id}).then( profile => {
        Post.findById(req.params.id)
        .then(post => {
            // Check if owner of the post is the same as in Profile
            if(post.user.toString() !== profile.user._id.toString()) {
                return res.status(401).json({notauthorized: 'You are not authorized to delete'})
            }
            //Delete
            post.remove().then(() => res.json({success : true}))
        })
        .catch(err => res.status(404).json({postnotfound: 'Post not found'}))
    })
})

/*
@route   POST api/posts/likes/:id
@desc    like a post 
@access  Private
*/ 
router.post('/likes/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.findById(req.params.id).then( post => {
        const newLike = {
            user: req.user.id
        }
        post.likes.unshift(newLike)
        post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({like: 'Unable to find post'}))
})

/*
@route   DELETE api/posts/likes/:post_id/:like_id
@desc    Unlike a post 
@access  Private
*/ 
router.delete('/likes/:post_id/:like_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.findById(req.params.post_id).then( post => {
        //find the index to delete in likes array 
        const indexToRemove = post.likes.map(like => like.id).indexOf(req.params.like_id)
        //Splice the likes array
        post.likes.splice(indexToRemove,1)
        //Save
        post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({unlike: 'Unable to unlike'}))
})

/*
@route   POST api/posts/comments/:id
@desc    Create a comment for a post 
@access  Private
*/ 
router.post('/comments/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.findById(req.params.id).then( post => {
        const newComment = {
            user: req.user.id,
            text: req.body.text,
            username: req.body.username,
            avatar: req.body.avatar,
            date: req.body.date
        }
        const {errors , isValid} = validateCommentInput(newComment)
        if(!isValid){
            return res.status(400).json(errors)
        }
        post.comments.unshift(newComment)
        post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({like: 'Unable to create comment'}))
})

/*
@route   DELETE api/posts/comments/:post_id/:comment_id
@desc    Remove comment from post
@access  Private
*/ 
router.delete('/comments/:post_id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.findById(req.params.post_id).then( post => {
        //find the index to delete in likes array 
        const indexToRemove = post.comments.map(comment => comment.id).indexOf(req.params.comment_id)
        //Splice the likes array
        post.comments.splice(indexToRemove,1)
        //Save
        post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({comment: 'Unable to delete comment'}))
})

module.exports = router