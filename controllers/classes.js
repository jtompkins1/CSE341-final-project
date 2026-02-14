const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Get all classes
const getAllClasses = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection('class').find();
        if (!result) {
            return res.status(400).json({ error: 'Error', message: 'No classes found.' });
        }
        //result.toArray().then((classes) => {
        const classes = await result.toArray(); 
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(classes);
       // });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error', message: err.message });
    }
};

// Get a specific class by ID
const getClassById = async (req, res) => {
    try {
        const classId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('class').findOne({ _id: classId });
        if (!result) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: 'Error', message: 'Class not found.' });
        }

        res.status(200).json(result);
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error', message: err.message });
    }
};

// Create a new class
const createClass = async (req, res) => {
    try {
        const newClass = {
            name: req.body.name,
            code: req.body.code,
            number: req.body.number,
            credits: req.body.credits
        };
        const response = await mongodb.getDatabase().db().collection('class').insertOne(newClass);
        if (!response.acknowledged) {
            return res.status(400).json({ error: 'Error', message: 'Failed to create class.' });
        }
        res.status(201).json({ message: 'Class created successfully', id: response.insertedId });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error', message: err.message });
    }
};

// Update a specific class
const updateClass = async (req, res) => {
    try {
        const classId = new ObjectId(req.params.id);
        const updatedClass = {
            name: req.body.name,
            code: req.body.code,
            number: req.body.number,
            credits: req.body.credits
        };
        const response = await mongodb.getDatabase().db().collection('class').replaceOne({ _id: classId }, updatedClass);
        if (response.modifiedCount > 0) {
            return res.status(200).json('Class updated successfully');
        } else {
            return res.status(404).json({ error: 'Error', message: 'Class not found or not updated.' });
        }
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error', message: err.message });
    }
};

// Delete a specific class
const deleteClass = async (req, res) => {
    try {
        const classId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('class').deleteOne({ _id: classId });
        if (response.deletedCount > 0) {
            return res.status(200).json('Class deleted successfully');
        } else {
            return res.status(404).json({ error: 'Error', message: 'Class not found.' });
        }
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error', message: err.message });
    }
};

module.exports = {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass
};
