/* Packages */
const jwt = require("jsonwebtoken");
const { users } = require("../../../models");

/* Middlewares */
const { getLoggedINUserById } = require("../../middlewares/user");

/* Token verification */
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(401).json({
            error: true,
            message: "Token missing",
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({
                error: true,
                message: "Invalid token",
            });
        }
        getLoggedINUserById(req, res, next, payload.u_id);
    });
};
