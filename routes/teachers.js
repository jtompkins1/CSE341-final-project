const express = require('express');
const router = express.Router();

const usersController = require('../controllers/teachers.js');
const validator = require('../middleware/validator.js');

router.get('/', usersController.getAll);

router.get('/:id',  usersController.getSingle);

router.get('/classtaught/:id',  usersController.getByClassTaught);

router.get('/subject/:id',  usersController.getBySubject);

router.post('/', validator.teacherRules(), validator.validate, usersController.addTeacher);

router.put('/:id', validator.teacherRules(), validator.validate, usersController.updateTeacher);

router.delete('/:id', usersController.deleteTeacher);

module.exports = router;