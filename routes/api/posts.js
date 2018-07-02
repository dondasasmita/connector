const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

//Load input validation
const validatePostInput = require('../../validation/post')

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

module.exports = router