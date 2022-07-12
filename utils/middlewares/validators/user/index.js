const { has } = require("lodash");
const { users } = require("../../../../models");

exports.userExists = (req, res, next) => {
    const { email } = req.body;
    if (email) {
        users
            .findAndCountAll({ where: { email: req.body.email } })
            .then((result) => {
                if (result.count) {
                    return res.status(403).json({
                        error: true,
                        message: "User's email is already exists",
                    });
                } else {
                    next();
                }
            })
            .catch((error) => {
                return res
                    .status(500)
                    .json({ error: true, message: error.message });
            });
    } else {
        //When user update only names
        next();
    }
};
