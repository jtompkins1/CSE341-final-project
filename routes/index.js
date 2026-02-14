const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
    res.send(req.session.user !== undefined ? `Logged in` : "Logged Out");
});

// Login & Logout
router.get('/login', passport.authenticate('github'));

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

router.use('/teachers', require('./teachers'));
router.use('/students', require('./students'));
router.use('/degrees', require('./degrees'));
router.use('/classes', require('./classes'));
// router.use('/', require('./'));
// router.use('/', require('./'));

module.exports = router;