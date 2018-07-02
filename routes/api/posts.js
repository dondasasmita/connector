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
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user:req.user.id}).then(profile => {
        Post.findById(req.params.id).then( post => {
            //Check if the user has liked the post
            //using filter function to return array (if found array.length will be greater than 0) 
            if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                return res.status(400).json({alreadyLiked: 'User has liked the post'})
            }
            //Add like
            const newLike = {
                user: req.user.id
            }
            post.likes.unshift(newLike)
            post.save().then(post => res.json(post))
        })
    })
    .catch(err => res.status(404).json({npPost: 'No post found'}))
})

/*
@route   DELETE api/posts/unlike/:id
@desc    Remove like from a post
@access  Private
*/ 
router.delete('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user:req.user.id}).then(profile => {
        Post.findById(req.params.id).then( post => {
            //Check if the user has not liked the post
            //using filter function to return array (if found array.length equals to 0) 
            if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                return res.status(400).json({notLiked: 'You have not yet liked the post'})
            }
            //find the index to remove in the likes array 
            const indexToRemove = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
            //Splice the index out of the likes array
            post.likes.splice(indexToRemove,1)
            //Save
            post.save().then(post => res.json(post))
        })
    })
    .catch(err => res.status(404).json({noPost: 'No post found'}))
})

/*
@route   POST api/posts/comment/:id
@desc    Create a comment for a post 
@access  Private
*/ 
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.findById(req.params.id).then( post => {
        const newComment = {
            user: req.user.id,
            text: req.body.text,
            username: req.body.username,
            avatar: req.body.avatar,
            date: req.body.date
        }
        // Validate the comment input
        const {errors , isValid} = validateCommentInput(newComment)
        if(!isValid){
            return res.status(400).json(errors)
        }
        //create the comment in the comments array
        post.comments.unshift(newComment)
        //save the post 
        post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({post: 'No post to comment'}))
})

/*
@route   DELETE api/posts/comment/:post_id/:comment_id
@desc    Remove comment from post
@access  Private
*/ 
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.findById(req.params.post_id).then( post => {
        //Check if the user has not commented the post
        //using filter function to return array (if found array.length equals to 0) 
        if(post.comments.filter(comment => comment.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({notCommented: 'You have not yet commented the post'})
        }
        //find the index to remove in the comment array 
        const indexToRemove = post.comments.map(comment => comment._id.toString()).indexOf(req.params.comment_id)
        //Splice the index out of the comments array
        post.comments.splice(indexToRemove,1)
        //Save
        post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({noPost: 'No post found'}))
})

module.exports = router