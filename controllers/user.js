/* Packages */
const bcrypt = require("bcrypt");
const { roles, users } = require("../models");
const { omit, has } = require("lodash");

exports.createUser = (req, res) => {
    users
        .create(req.body)
        .then((user) => {
            let userData = user.dataValues;
            omit(userData, ["password", "createdAt", "updatedAt"]);
            res.status(200).json({
                success: true,
                message: "New user has been created",
                user: userData,
            });
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ error: true, message: error.message });
        });
};

exports.listUsers = (req, res) => {
    users
        .findAll()
        .then((users) => {
            let result = [];
            users.map((user) => {
                user.account_status &&
                    (result = [
                        ...result,
                        omit(user.dataValues, [
                            "password",
                            "account_status",
                            "createdAt",
                            "updatedAt",
                        ]),
                    ]);
            });
            res.status(200).json(result);
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ error: true, message: error.message });
        });
};

exports.listAllUsers = (req, res) => {
    users
        .findAll()
        .then((users) => {
            let result = [];
            users.map((user) => {
                result = [
                    ...result,
                    omit(user.dataValues, [
                        "password",
                        "createdAt",
                        "updatedAt",
                    ]),
                ];
            });
            res.status(200).json(result);
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ error: true, message: error.message });
        });
};

exports.deleteUser = (req, res) => {
    const { u_id, first_name } = req.userData;
    const account_status = false;

    users
        .update({ account_status }, { where: { u_id } })
        .then(() => {
            res.status(200).json({
                success: true,
                message: first_name + " has been deleted",
            });
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ error: true, message: error.message });
        });
};

exports.updateUser = (req, res) => {
    let { first_name, last_name } = req.body;
    let { loggedInUser } = req;

    users
        .findOne({ where: { u_id: loggedInUser.u_id } })
        .then((result) => {
            result
                .update({ first_name, last_name })
                .then(() => {
                    res.status(200).json({
                        success: true,
                        message: "Personal deatails have been updated",
                    });
                })
                .catch((error) => {
                    return res
                        .status(500)
                        .json({ error: true, message: error.message });
                });
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ error: true, message: error.message });
        });
};

exports.updateUserPassword = async (req, res) => {
    const { current_password, new_password } = req.body.user;

    users
        .findOne({ where: { u_id: req.loggedInUser.u_id } })
        .then((user) => {
            user.validatePassword(current_password, user.password)
                .then((result) => {
                    if (!result)
                        return res.status(403).json({
                            error: true,
                            message: "Invalid password",
                        });

                    bcrypt.genSalt(10, "a").then((salt) => {
                        bcrypt
                            .hash(new_password, salt, (err, password) => {
                                user.update({ password })
                                    .then(() => {
                                        return res.status(200).json({
                                            success: true,
                                            message:
                                                "Password has been updated",
                                        });
                                    })
                                    .catch((error) => {
                                        return res.status(500).json({
                                            error: true,
                                            message: error.message,
                                        });
                                    });
                            })
                            .catch((error) => {
                                return res.status(500).json({
                                    error: true,
                                    message: error.message,
                                });
                            });
                    });
                })
                .catch((error) => {
                    return res
                        .status(500)
                        .json({ error: true, message: error.message });
                });
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ error: true, message: error.message });
        });
};

exports.updateUserByAdmin = (req, res) => {
    let userDataFromFront = req.body.user;

    users
        .findOne({ where: { u_id: req.userData.u_id } })
        .then((user) => {
            bcrypt
                .genSalt(10, "a")
                .then((salt) => {
                    bcrypt
                        .hash(
                            userDataFromFront.password,
                            salt,
                            (err, password) => {
                                userDataFromFront = {
                                    ...userDataFromFront,
                                    password,
                                };
                                user.update(userDataFromFront)
                                    .then(() => {
                                        return res.status(200).json({
                                            success: true,
                                            message:
                                                "User data has been updated",
                                        });
                                    })
                                    .catch((error) => {
                                        return res.status(500).json({
                                            error: true,
                                            message: error.message,
                                        });
                                    });
                            }
                        )
                        .catch((error) => {
                            return res
                                .status(500)
                                .json({ error: true, message: error.message });
                        });
                })
                .catch((error) => {
                    return res
                        .status(500)
                        .json({ error: true, message: error.message });
                });
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ error: true, message: error.message });
        });
};
