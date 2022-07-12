const { users } = require("../models");

exports.getMember = (array) => {
    users
        .findAll({
            where: { u_id: array },
            attributes: {
                exclude: [
                    "password",
                    "account_status",
                    "createdAt",
                    "updatedAt",
                ],
            },
        })
        .then((users) => {
            return users;
        });
};
