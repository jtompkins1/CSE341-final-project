const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req,res) => {
    //#swagger.tags=['Teacher']
        const result = await mongodb.getDatabase().db().collection('teacher').find(); 
        if (!result){
            return res.status(400).json({error: 'Error', message: 'Sorry No Content',});
        }
        result.toArray().then((teachers) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(teachers)
        });

};

const getSingle = async (req,res) => {
    //#swagger.tags=['Teacher']
    try {
        const teacherId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('teacher').findOne({ _id: teacherId }); 
        if (!result){
                return res.status(400).json({error: 'Error', message: 'The ID dont mach whit any of the Teachers, try anoter id',});
            }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({error: 'Error', message: err.message,});
    }
};

const getByClassTaught = async (req,res) => {
    //#swagger.tags=['Teacher']
    try {
        const teacherClass = req.params.id;
        const result = await mongodb.getDatabase().db().collection('teacher').find({ classTaught: teacherClass }).toArray();
        if (!result){
                return res.status(400).json({error: 'Error', message: 'The subject dont mach whit any of the Teachers classes, try anoter class',});
            }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({error: 'Error', message: err.message,});
    }
};

const getBySubject = async (req,res) => {
    //#swagger.tags=['Teacher']
    try {
        const teacherSubject = req.params.id;
        const result = await mongodb.getDatabase().db().collection('teacher').find({ subject: teacherSubject }).toArray();
        if (!result){
                return res.status(400).json({error: 'Error', message: 'The subject dont mach whit any of the Teachers subjects, try anoter subject',});
            }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({error: 'Error', message: err.message,});
    }
};

const addTeacher = async (req,res) => {
    //#swagger.tags=['Teacher']
    try {
        const teacher = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            classTaught: req.body.classTaught,
            email: req.body.email, 
            phone: req.body.phone,  
            subject: req.body.subject
        };
        const response = await mongodb.getDatabase().db().collection('teacher').insertOne(teacher); 
        if (response.modifiedCount > 0){
            return res.status(400).json({error: 'Error', message: 'Some error has hapen in the Creation of a Teacher account.',});
        }
        const result = await mongodb.getDatabase().db().collection('teacher').find().sort({'_id':-1}).limit(1); 
        if (!result){
            return res.status(400).json({error: 'Error', message: 'Some error has hapen in the Creation of a Teacher account.',});
        }
        result.toArray().then((teacher) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(`The Id of the new Teacher account is:${teacher[0]._id}`);
        });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({error: 'Error', message: err.message,});
    }
};
 
const updateTeacher = async (req, res) => {
    //#swagger.tags=['Teacher']
    try {
        const teacherId = new ObjectId(req.params.id);
        const teacher = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            classTaught: req.body.classTaught,
            email: req.body.email, 
            phone: req.body.phone,  
            subject: req.body.subject
        };
        const response = await mongodb.getDatabase().db().collection('teacher').replaceOne({ _id: teacherId }, teacher);
        if (response.modifiedCount > 0) {
            return res.status(200).json('The Updating of the Teacher account was successful');
        } else {
            return res.status(500).json({error: 'Error', message: 'Some error has hapen in the Updating of the Teacher account. Try anoter id',})
        }
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({error: 'Error', message: err.message,});
}};

const deleteTeacher = async (req, res) => {
    //#swagger.tags=['Teacher']
    try {
        const teacherId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('teacher').deleteOne({ _id: teacherId }); 
    if (response.deletedCount > 0) {
        return res.status(200).json('The Deleting of the Teacher account was successful');
    } else {
        return res.status(500).json({error: 'Error', message: 'Some error has hapen Deleting the Teacher account. Try whit a diferent Id',});
    }
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({error: 'Error', message: err.message,});
}};

module.exports = {
    getAll,
    getSingle,
    getByClassTaught,
    getBySubject,
    addTeacher,
    updateTeacher,
    deleteTeacher
};