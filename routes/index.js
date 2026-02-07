const studentsController = require('../controllers/studentsController');
const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.use('/teachers', require('./teachers'));
router.use('/students', require('./students'));
// router.use('/', require('./'));
// router.use('/', require('./'));

module.exports = router;