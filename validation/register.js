const Validator = require('validator')
const isEmpty = require('./is-empty') 

module.exports = function validateRegisterInput(data) {
    let errors = {}

    data.username = !isEmpty(data.username) ? data.username : ''
    data.email = !isEmpty(data.email) ? data.email : ''
    data.password = !isEmpty(data.password) ? data.password : ''
    data.password2 = !isEmpty(data.password2) ? data.password2 : ''

    // Validate username length
    if (!Validator.isLength(data.username, {min: 2, max: 30})) {
        errors.username = 'Username must be between 2 and 30 characters'
    }

    if (Validator.isEmpty(data.username)) {
        errors.username = 'Username is required'
    }

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

    if (!Validator.isLength(data.password, {min: 5 , max: 30})) {
        errors.password = 'Password must be between 5 to 30 characters'
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm your password'
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords must match'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

}