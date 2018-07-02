/*
============
Method to validate post fields
It will return errors object or a valid data 
============
*/

//load dependencies
const Validator = require('validator')
const isEmpty = require('./is-empty') 

module.exports = function validatePostInput(data) {
    let errors = {}

    data.text = !isEmpty(data.text) ? data.text : ''

    // Validate text
    if (!Validator.isLength(data.text, {min: 10, max: 300})){
        errors.text = 'Post must be between 10 to 300 charactes'
    }

    if (Validator.isEmpty(data.text)) {
        errors.text = 'Post text is required'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}