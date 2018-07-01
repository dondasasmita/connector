const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

//Load input validation
const validateProfileInput = require('../../validation/profile')

// load profile and user models
const Profile = require('../models/Profile')
const User = require('../models/User')

/*
@route   GET api/profile/test
@desc    Tests profile route
@access  Public
*/ 
router.get('/test', (req, res) => res.json({
    msg: "Profile Works"
}))

/*
@route   GET api/profile
@desc    Get current user's profile
@access  Private
*/
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {}
    //find one user with the ID from the Profile schema
    Profile.findOne({user: req.user.id})
    //get username and avatar from user object
    .populate('user',['username', 'avatar'])
    .then(profile => {
        if(!profile) {
            errors.noprofile = 'There is no profile found'
            return res.status(404).json(errors)
        }
        res.json(profile)
    })
    .catch( err => res.status(404).json(err))
})

/*
@route   GET api/profile/all
@desc    Get all users profile
@access  Public
*/
router.get('/all', (req, res) => {
    //initialized errors object
    const errors = {}
    //find user by the handle name from the url param
    Profile.find()
    //get username and avatar from user object
    .populate('user',['username', 'avatar'])
    .then(profiles => {
        if(!profiles){
            errors.noprofiles = 'There are no profiles found'
            return res.status(404).json(errors)
        }
        res.json(profiles)
    })
    .catch(err => res.status(404).json({profile: 'There are no profiles found'}))
})
 
/*
@route   GET api/profile/handle/:handle
@desc    Get profile by handle(username)
@access  Public
*/
router.get('/handle/:handle', (req, res) => {
    //initialized errors object
    const errors = {}
    //find user by the handle name from the url param
    Profile.findOne({handle: req.params.handle})
    //get username and avatar from user object
    .populate('user',['username', 'avatar'])
    .then(profile => {
        if(!profile){
            //error message
            errors.noprofile = 'No profile found for this user'
            return res.status(404).json(errors)
        }
        res.json(profile)
    })
    .catch(err => res.status(404).json({profile: 'No profile found for this user'}))
})

/*
@route   GET api/profile/user/:user_id
@desc    Get profile by user ID
@access  Public
*/
router.get('/user/:user_id', (req, res) => {
    //initialized errors object
    const errors = {}
    //find user by the handle name from the url param
    Profile.findOne({user: req.params.user_id})
    //get username and avatar from user object
    .populate('user',['username', 'avatar'])
    .then(profile => {
        if(!profile){
            //error message
            errors.noprofile = 'No profile found for this user'
            return res.status(404).json(errors)
        }
        res.json(profile)
    })
    .catch(err => res.status(404).json({profile: 'No profile found for this user'}))
})


/*
@route   POST api/profile
@desc    Create and Update current user's profile
@access  Private
*/
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateProfileInput(req.body)
    //check validation
    if (!isValid) {
        // if request is not valid, return response with status 400
        return res.status(400).json(errors)
    }

    //Get all fields and store in profileFields object
    const profileFields = {}
    //find the user by ID  
    profileFields.user = req.user.id
    //Insert fields
    if (req.body.handle) {
        profileFields.handle = req.body.handle
    }
    if (req.body.company) {
        profileFields.company = req.body.company
    }
    if (req.body.website) {
        profileFields.website = req.body.website
    }
    if (req.body.location) {
        profileFields.location = req.body.location
    }
    if (req.body.status) {
        profileFields.status = req.body.status
    }
    // Skills are split into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',')
    }
    if (req.body.bio) {
        profileFields.bio = req.body.bio
    }
    if (req.body.githubusername) {
        profileFields.githubusername = req.body.githubusername
    }
    // Social
    // initialize social object
    profileFields.social = {}
    if (req.body.youtube) {
        profileFields.social.youtube = req.body.youtube
    }
    if (req.body.facebook) {
        profileFields.social.facebook = req.body.facebook
    }
    if (req.body.twitter) {
        profileFields.social.twitter = req.body.twitter
    }
    if (req.body.linkedin) {
        profileFields.social.linkedin = req.body.linkedin
    }
    if (req.body.instagram) {
        profileFields.social.instagram = req.body.instagram
    }
    if (req.body.date) {
        profileFields.date = req.body.date
    }

    Profile.findOne({user: req.user.id})
    .then(profile => {
        //if profile exists
        if(profile) {
            //update profile
            Profile.findOneAndUpdate(
                {user: req.user.id}, 
                {$set: profileFields},
                {new: true}
            )
            .then(profile => res.json(profile))
        } else {
            //create profile
            //check if handle exists
            Profile.findOne({handle: req.body.handle})
            .then(profile => {
                if (profile) {
                    errors.handle = 'Handle exists'
                    res.status(400).json(errors)
                }
                //save profile
                new Profile(profileFields).save().then(profile => res.json(profile))
            })
        }
    })
})




module.exports = router