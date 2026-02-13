const isAuthenticated = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json("You do not have access. Please login first.");
    }
    next();
};

module.exports = { isAuthenticated };