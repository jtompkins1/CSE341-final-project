const express = require('express');
const router = express.Router();
const usersController = require('../controllers/students.js');
const validator = require('../middleware/validator.js');
const { isAuthenticated } = require("../middleware/authenticate.js"); 

router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);
router.get('/degree/:id', usersController.getByDegree);
router.get('/class/:id', usersController.getByClass);


router.post('/', isAuthenticated, validator.studentRules(), validator.validate, usersController.addStudent);
router.put('/:id', isAuthenticated, validator.studentRules(), validator.validate, usersController.updateStudent);
router.delete('/:id', isAuthenticated, usersController.deleteStudent); 

module.exports = router;