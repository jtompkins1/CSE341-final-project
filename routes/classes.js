const express = require('express');
const router = express.Router();
const classesController = require('../controllers/classes');

// Get all classes
router.get('/', classesController.getAllClasses);

// Get a specific class by ID
router.get('/:id', classesController.getClassById);

// Create a new class
router.post('/', classesController.createClass);

// Update a specific class
router.put('/:id', classesController.updateClass);

// Delete a specific class
router.delete('/:id', classesController.deleteClass);

module.exports = router;
