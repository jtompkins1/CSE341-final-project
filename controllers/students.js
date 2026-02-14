const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Students']
    try{
        const result = await mongodb.getDatabase().db().collection('student').find(); 
        if (!result){
                return res.status(400).json({error: 'Error', message: 'Sorry No Content',});
            }
            await result.toArray().then((products) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(products)
            });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({error: 'Error', message: err.message,});
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Students']
    try {
    const studentsId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('student').findOne({ _id: studentsId }); 
    if (!result){
            return res.status(404).json({error: 'Error', message: 'The ID dont mach whit any of the Students, try anoter id',});
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({error: 'Error', message: err.message,});
    }
};

const getByDegree = async (req, res) => {
    //#swagger.tags=['Students']
    try {
    const studentsDegree = req.params.id;
    const result = await mongodb.getDatabase().db().collection('student').find({ degree: studentsDegree }).toArray(); 
    if (!result){
            return res.status(400).json({error: 'Error', message: 'The Degree dont mach whit any of the Students, try anoter Degree',});
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({error: 'Error', message: err.message,});
    }
};

const getByClass = async (req, res) => {
    //#swagger.tags=['Students']
    try {
    const studentsClass = req.params.id;
    const result = await mongodb.getDatabase().db().collection('student').find({ class: studentsClass }).toArray(); 
    if (!result){
            return res.status(400).json({error: 'Error', message: 'The Class dont mach whit any of the Students, try anoter Class',});
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({error: 'Error', message: err.message,});
    }
};

const addStudent = async (req, res) => {
    //#swagger.tags=['Students']
    try {
        const student = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            degree: req.body.degree,
            class: req.body.class
        };
        const response = await mongodb.getDatabase().db().collection('student').insertOne(student); 
        if (response.modifiedCount > 0){
                return res.status(400).json({error: 'Error', message: 'Some error has hapen in the Creation of a Student account.',});
        }
        const result = await mongodb.getDatabase().db().collection('student').find().sort({'_id':-1}).limit(1); 
        if (!result){
            return res.status(400).json({error: 'Error', message: 'Some error has hapen in the Creation of a Student account.',});
        }
        result.toArray().then((student) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(`The Id of the new Student account is:${student[0]._id}`);
        });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({error: 'Error', message: err.message,});
    }
};
 
const updateStudent = async (req, res) => {
    //#swagger.tags=['Students']
    try {
        const studentsId = new ObjectId(req.params.id);
        const student = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            degree: req.body.degree,
            class: req.body.class
        };
        const response = await mongodb.getDatabase().db().collection('student').replaceOne({ _id: studentsId }, student); 
        if (response.modifiedCount > 0) {
            return res.status(200).json('The Updating of the Student account was successful');
        } else {
            return res.status(500).json({error: 'Error', message: 'Some error has hapen in the Updating of the Student account. Try anoter id',})
        }
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({error: 'Error', message: err.message,});
    }
};

const deleteStudent = async (req, res) => {
    //#swagger.tags=['Students']
    try {
    const studentsId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('student').deleteOne({ _id: studentsId }); 
    if (response.deletedCount > 0) {
            return res.status(200).json('The Deleting of the Student account was successful');
        } else {
            return res.status(500).json({error: 'Error', message: 'Some error has hapen Deleting the Student account. Try whit a diferent Id',});
        }
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({error: 'Error', message: err.message,});
    }
};

module.exports = {
    getAll,
    getSingle,
    getByDegree,
    getByClass,
    addStudent,
    updateStudent,
    deleteStudent
};