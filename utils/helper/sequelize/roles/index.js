const { roles } = require("../../../../models");

exports.createRole = (data, callback) => {
    roles.create(data).then((role) => callback(role));
    // .catch((err) => callback(err));
};

exports.createRoleSync = async (data) => {
    const response = await roles.create(data);
    return response;
};
