const mongodb = require('../data/database')
const ObjectId = require('mongodb').ObjectId;



const getAllStudents = async (req, res) => {
  const result = await mongodb
    .getDatabase()
    .db('university')
    .collection('teacher')
    .find();
  result.toArray().then((studentsEnrolled) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(studentsEnrolled);
  })
}


module.exports = {
    getAllStudents,
}