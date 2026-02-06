const { body, validationResult } = require('express-validator')

const teacherRules = () => {
  return [
    body('firstName').isLength({ min: 2 }).withMessage('The firts name of the teacher account must be minimum 2 characters'),
    body('lastName').isLength({ min: 2 }).withMessage('The second name of the teacher account must be minimum 2 characters'),
    body('dateOfBirth').isLength({ min: 6 }).withMessage('The date of bird of the account must be this format day-mont-year'),
    body('classTaught').isLength({ min: 2 }).withMessage('The name of the class most have minimum 2 characters'),
    body('email').isEmail().withMessage('The email mus have the email estructure(x.@x.com)'),
    body('phone').isLength({ min: 10 }).withMessage('The phone most have this format xxx-xxx-xxxx'),
    body('subject').isLength({ min: 2 }).withMessage('The subject of the product must be minimum 3 characters'),
  ]
}

const studentRules = () => {
  return [
    body('firstName').isLength({ min: 2 }).withMessage('The firts name of the student account must be minimum 2 characters'),
    body('lastName').isLength({ min: 2 }).withMessage('The second name of the student account must be minimum 2 characters'),
    body('phone').isLength({ min: 10 }).withMessage('The phone most have this format xxx-xxx-xxxx'),
    body('email').isEmail().withMessage('The email mus have the email estructure(x.@x.com)'),
    body('degree').isLength({ min: 2 }).withMessage('The degree most be minimum 3 characters'),
    body('class').isLength({ min: 2 }).withMessage('The name of the class most have minimum 2 characters'),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(500).json({
    errors: extractedErrors,
  })
}

module.exports = {
  studentRules,
  teacherRules,
  validate
}