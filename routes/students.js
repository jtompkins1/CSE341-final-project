const express = require('express');
const router = express.Router();

const usersController = require('../controllers/students.js');
const validator = require('../middleware/validator.js');

router.get('/', usersController.getAll);

router.get('/:id',  usersController.getSingle);

router.get('/degree/:id',  usersController.getByDegree);

router.get('/class/:id',  usersController.getByClass);

router.post('/', validator.studentRules(), validator.validate, usersController.addStudent);

router.put('/:id', validator.studentRules(), validator.validate, usersController.updateStudent);

router.delete('/:id', usersController.deleteStudent); 

module.exports = router;