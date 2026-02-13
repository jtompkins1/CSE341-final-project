const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require('passport'); 
const session = require('express-session'); 
const GitHubStrategy = require('passport-github2').Strategy; 
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(session({
    secret: "group-project-secret",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'], origin: '*' }));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
}
));

passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((user, done) => { done(null, user); });


app.use('/', require('./routes'));


app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: true
}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

mongodb.initDb((err) => {
    if (err) {
        console.log('Unable to connect to database', err);
    } else {
        app.listen(port, () => {
            console.log(`Database is listening and node is running on port ${port}`);
        });
    }
});