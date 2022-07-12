const { users, roles } = require("../../../models");
const { omit } = require("lodash");

exports.getLoggedINUserById = (req, res, next, u_id) => {
    users
        .findOne({ where: { u_id }, include: [{ model: roles, as: "role" }] })
        .then((user) => {
            if (user) {
                req.loggedInUser = user;
                let userData = {};
                let role = {
                    r_id: user.role.r_id,
                    name: user.role.name,
                    description: user.role.description,
                    permissions: user.role.permissions,
                };

                userData = user.dataValues;
                omit(userData, ["role"]);
                userData = { ...userData, role: role };
                req.loggedInUser = userData;

                next();
            } else {
                return res.json({ error: true, messgae: "Invalid user" });
            }
        });
};

exports.getUserById = (req, res, next, u_id) => {
    users
        .findOne({ where: { u_id }, include: [{ model: roles, as: "role" }] })
        .then((user) => {
            if (user) {
                req.userData = user;
                next();
            } else {
                return res.json({ error: true, messgae: "Invalid user." });
            }
        });
};
