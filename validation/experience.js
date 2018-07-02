/*
============
Method to validate experience fields
It will return errors object or a valid data 
============
*/

//load dependencies
const Validator = require('validator')
const isEmpty = require('./is-empty') 

module.exports = function validateExperienceInput(data) {
    let errors = {}

    data.title = !isEmpty(data.title) ? data.title : ''
    data.company = !isEmpty(data.company) ? data.company : ''
    data.from = !isEmpty(data.from) ? data.from : ''

    // Validate title
    if (Validator.isEmpty(data.title)) {
        errors.title = 'Job title is required'
    }

    // Validate company
    if (Validator.isEmpty(data.company)) {
        errors.company = 'Name of company is required'
    }

    
    // Validate from field
    if (Validator.isEmpty(data.from)) {
        errors.from = 'From date field is required'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

}