/* Packages */
const {
    createRole,
    createRoleSync,
} = require("../utils/helper/sequelize/roles");
const { createUser } = require("../utils/helper/sequelize/users");

const roleData = (type, idArray) => {
    switch (type) {
        case "super admin":
            return {
                name: "Super admin",
                description: "This guy can do a lot more then your imagination",
                can_delete: false,
                permissions: {
                    user: {
                        admin: true,
                        create: true,
                        read: true,
                        update: true,
                        delete: true,
                    },
                    role: {
                        whoCanAssign: {
                            r_ids: idArray,
                        },
                        admin: true,
                        create: true,
                        read: true,
                        update: true,
                        delete: true,
                    },
                    board: {
                        admin: true,
                        create: true,
                        read: true,
                        update: true,
                        delete: true,
                        read_all: true,
                    },
                    ticket: {
                        admin: true,
                        create: true,
                        read: true,
                        update: true,
                        delete: true,
                        read_all: true,
                    },
                },
            };
        case "supervisor":
            return {
                name: "Supervisor",
                description: "Supervisor can manage boards and users.",
                can_delete: false,
                permissions: {
                    user: {
                        admin: true,
                        create: true,
                        read: true,
                        update: true,
                        delete: true,
                    },
                    role: {
                        whoCanAssign: {
                            r_ids: idArray,
                        },
                        admin: false,
                        create: false,
                        read: true,
                        update: false,
                        delete: false,
                    },
                    board: {
                        admin: true,
                        create: true,
                        read: true,
                        update: true,
                        delete: true,
                        approval: true,
                        read_all: true,
                    },
                    ticket: {
                        admin: true,
                        create: true,
                        read: true,
                        update: true,
                        delete: true,
                    },
                },
            };
        case "user":
            return {
                name: "User",
                description: "I am just a common guy",
                permissions: {
                    user: {
                        admin: false,
                        create: false,
                        read: false,
                        update: false,
                        delete: false,
                    },
                    role: {
                        whoCanAssign: {
                            r_ids: idArray,
                        },
                        admin: false,
                        create: false,
                        read: true,
                        update: false,
                        delete: false,
                    },
                    board: {
                        admin: false,
                        create: false,
                        read: true,
                        update: false,
                        delete: false,
                        approval: false,
                    },
                    ticket: {
                        admin: false,
                        create: false,
                        read: true,
                        update: false,
                        delete: false,
                    },
                },
                can_delete: false,
            };
    }
};

exports.initSystem = async (req, res) => {
    let superAdmin,
        supervisor = {};

    superAdmin = await createRoleSync(roleData("super admin", []));
    supervisor = await createRoleSync(
        roleData("supervisor", [superAdmin.r_id])
    );

    createRole(
        roleData("user", [superAdmin.r_id, supervisor.r_id]),
        (role) => {}
    );

    createUser(
        {
            first_name: "Jay",
            last_name: "Pancholi",
            email: "jaypancholi94@gmail.com",
            password: "Test@1234",
            account_status: true,
            r_id: superAdmin.r_id,
        },
        (user) => {
            res.json({ message: `User with ${user.email} has been created.` });
        }
    );
};
