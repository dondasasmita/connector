/*
============
Method to validate education fields
It will return errors object or a valid data 
============
*/

//load dependencies
const Validator = require('validator')
const isEmpty = require('./is-empty') 

module.exports = function validateEducationInput(data) {
    let errors = {}

    data.school = !isEmpty(data.school) ? data.school : ''
    data.degree = !isEmpty(data.degree) ? data.degree : ''
    data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : ''
    data.from = !isEmpty(data.from) ? data.from : ''

    // Validate school
    if (Validator.isEmpty(data.school)) {
        errors.school = 'Name of school is required'
    }

    // Validate degree
    if (Validator.isEmpty(data.degree)) {
        errors.degree = 'Degree is required'
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