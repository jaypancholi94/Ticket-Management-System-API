/* Package */
const { users, roles } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = function (req, res) {
    const { email, password } = req.body;

    users
        .findOne({ where: { email }, include: [{ model: roles, as: "role" }] })
        .then((user) => {
            if (user) {
                if (!user.account_status) {
                    return res.json({
                        error: "Your account has been suspended. Please contact Admin.",
                    });
                }
                user.validatePassword(password, user.password).then(
                    (result) => {
                        if (result) {
                            const { u_id, first_name, last_name, email } = user;
                            const payload = {
                                u_id,
                                first_name,
                                last_name,
                                email,
                            };

                            let role = {
                                r_id: user.role.r_id,
                                name: user.role.name,
                                description: user.role.description,
                                permissions: user.role.permissions,
                            };

                            const token = jwt.sign(
                                payload,
                                process.env.JWT_SECRET,
                                {
                                    expiresIn: "2d",
                                }
                            );

                            return res.status(200).json({
                                token,
                                user: payload,
                                role,
                            });
                        } else {
                            return res.status(403).json({
                                error: true,
                                message: "Invalid password",
                            });
                        }
                    }
                );
            } else {
                return res
                    .status(403)
                    .json({ error: true, message: "Invalid user" });
            }
        })
        .catch((err) => {
            return res.status(500).json({ error: true, message: err.message });
        });
};
