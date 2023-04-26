const jwt = require("jsonwebtoken");
const _ = require("lodash");

const verifyJwt = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    //check if bearer is undefined
    if (bearerHeader) {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(400).json({
                    isAuthenticate: false,
                    message: "Requête non authentifiée",
                });
            }
            req.user = _.pick(decoded, ["id", "email"]);
            next();
        });
    } else {
        return res.end();
    }
};

module.exports = { verifyJwt };
