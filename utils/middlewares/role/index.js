/* Packages */
const { includes } = require("lodash");
const { roles } = require("../../../models");

exports.verifyPermission = (type, action) => (req, res, next) => {
    if (req.loggedInUser.role.permissions[type][action]) {
        next();
        return;
    }

    return res.status(401).json({
        error: true,
        message: "You are not authorized to perform this action",
    });
};

exports.verifyAssignedRole = (req, res, next) => {
    roles
        .findOne({ where: { r_id: req.body.r_id } })
        .then((role) => {
            if (!role) {
                return res.status(403).json({
                    error: true,
                    message: "Invalid user role",
                });
            }

            if (
                includes(
                    role.permissions.role.whoCanAssign.r_ids,
                    req.loggedInUser.r_id
                )
            ) {
                next();
            } else {
                return res.status(401).json({
                    error: true,
                    message: "You are not authorized to perform this action",
                });
            }
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ error: true, message: error.message });
        });
};
