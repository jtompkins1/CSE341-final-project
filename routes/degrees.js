const express = require('express');
const router = express.Router();
const degreesController = require('../controllers/degrees');

// Get all degrees
router.get('/', degreesController.getAllDegrees);

// Get a specific degree by ID
router.get('/:id', degreesController.getDegreeById);

// Create a new degree
router.post('/', degreesController.createDegree);

// Update a specific degree
router.put('/:id', degreesController.updateDegree);

// Delete a specific degree
router.delete('/:id', degreesController.deleteDegree);

module.exports = router;
