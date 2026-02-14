const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Get all degrees
const getAllDegrees = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection('degree').find();
        if (!result) {
            return res.status(400).json({ error: 'Error', message: 'No degrees found.' });
        }
        await result.toArray().then((degrees) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(degrees);
        });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error', message: err.message });
    }
};

// Get a specific degree by ID
const getDegreeById = async (req, res) => {
    try {
        const degreeId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('degree').findOne({ _id: degreeId });
        if (!result) {
            return res.status(404).json({ error: 'Error', message: 'Degree not found.' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error', message: err.message });
    }
};

// Create a new degree
const createDegree = async (req, res) => {
    try {
        const degree = {
            name: req.body.name,
            code: req.body.code,
            requiredCredits: req.body.requiredCredits
        };
        const response = await mongodb.getDatabase().db().collection('degree').insertOne(degree);
        if (!response.acknowledged) {
            return res.status(400).json({ error: 'Error', message: 'Failed to create degree.' });
        }
        res.status(201).json({ message: 'Degree created successfully', id: response.insertedId });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error', message: err.message });
    }
};

// Update a specific degree
const updateDegree = async (req, res) => {
    try {
        const degreeId = new ObjectId(req.params.id);
        const degree = {
            name: req.body.name,
            code: req.body.code,
            requiredCredits: req.body.requiredCredits
        };
        const response = await mongodb.getDatabase().db().collection('degree').replaceOne({ _id: degreeId }, degree);
        if (response.modifiedCount > 0) {
            return res.status(200).json('Degree updated successfully');
        } else {
            return res.status(404).json({ error: 'Error', message: 'Degree not found or not updated.' });
        }
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error', message: err.message });
    }
};

// Delete a specific degree
const deleteDegree = async (req, res) => {
    try {
        const degreeId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('degree').deleteOne({ _id: degreeId });
        if (response.deletedCount > 0) {
            return res.status(200).json('Degree deleted successfully');
        } else {
            return res.status(404).json({ error: 'Error', message: 'Degree not found.' });
        }
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error', message: err.message });
    }
};

module.exports = {
    getAllDegrees,
    getDegreeById,
    createDegree,
    updateDegree,
    deleteDegree
};
