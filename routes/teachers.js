const express = require('express');
const router = express.Router();

const usersController = require('../controllers/teachers.js');
const validator = require('../middleware/validator.js');
const { isAuthenticated } = require("../middleware/authenticate.js"); 

// GET 
router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);
router.get('/classtaught/:id', usersController.getByClassTaught);
router.get('/subject/:id', usersController.getBySubject);


router.post('/', 
    isAuthenticated, 
    validator.teacherRules(), 
    validator.validate, 
    usersController.addTeacher
);

router.put('/:id', 
    isAuthenticated, 
    validator.teacherRules(), 
    validator.validate, 
    usersController.updateTeacher
);

router.delete('/:id', 
    isAuthenticated, 
    usersController.deleteTeacher
);

module.exports = router;