const studentsController = require('../controllers/studentsController');
const router = require('express').Router();


router.get('/', (req, res) => {
  res.send('Hello World!');
});



// BRANDON's EXAMPLE ROUTE TO DEMONSTRATE 
// THAT THE MONGODB DATABASE IS CONNECTED:

router.get('/students', studentsController.getAllStudents);

module.exports = router;