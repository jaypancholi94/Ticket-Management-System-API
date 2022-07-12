const { users } = require("../../../../models");

exports.createUser = (data, callback) => {
    users.create(data).then((user) => callback(user));
    // .catch((err) => callback(err));
};
