/*
============
Method to validate user data 
It will return errors object or a valid data 
============
*/

//load the dependencies
const Validator = require('validator')
const isEmpty = require('./is-empty') 

module.exports = function validateLoginInput(data) {
    let errors = {}

    data.email = !isEmpty(data.email) ? data.email : ''
    data.password = !isEmpty(data.password) ? data.password : ''

    // Validate email address
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email is required'
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Enter a valid email'
    }

    // Validate password
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
