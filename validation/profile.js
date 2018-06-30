/*
============
Method to validate profile date 
It will return errors object or a valid data 
============
*/

//load dependencies
const Validator = require('validator')
const isEmpty = require('./is-empty') 

module.exports = function validateProfileInput(data) {
    let errors = {}

    data.handle = !isEmpty(data.handle) ? data.handle : ''
    data.status = !isEmpty(data.status) ? data.status : ''
    data.skills = !isEmpty(data.skills) ? data.skills : ''

    // Validate handle
    if(!Validator.isLength(data.handle,{min: 2, max: 40})){
        errors.handle = 'Handle must be between 2 to 40 characters'
    }
    if(Validator.isEmpty(data.handle)){
        errors.handle = 'Profile handle is required'
    }

    // Validate status
    if(Validator.isEmpty(data.status)){
        errors.status = 'Status field is required'
    }

    // Validate skills
    if(Validator.isEmpty(data.skills)){
        errors.skills = 'Skills field is required'
    }

    // Validate website
        // if not empty, check if it is a valid URL
    if(!isEmpty(data.website) && !Validator.isURL(data.website)){
        errors.website = 'Not a valid URL'
    }

    // Validate Social Network
        // if not empty, check if it is a valid URL
    if(!isEmpty(data.youtube) && !Validator.isURL(data.youtube)){
        errors.youtube = 'Not a valid URL'
    }
        // if not empty, check if it is a valid URL
    if(!isEmpty(data.facebook) && !Validator.isURL(data.facebook)){
        errors.facebook = 'Not a valid URL'
    }
        // if not empty, check if it is a valid URL
    if(!isEmpty(data.twitter) && !Validator.isURL(data.twitter)){
        errors.twitter = 'Not a valid URL'
    }
        // if not empty, check if it is a valid URL
    if(!isEmpty(data.linkedin) && !Validator.isURL(data.linkedin)){
        errors.linkedin = 'Not a valid URL'
    }
        // if not empty, check if it is a valid URL
    if(!isEmpty(data.instagram) && !Validator.isURL(data.instagram)){
        errors.instagram = 'Not a valid URL'
    }

    return {
        errors,
        //is valid if errors are empty
        isValid: isEmpty(errors)
    }

}