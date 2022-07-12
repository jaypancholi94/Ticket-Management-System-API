const bcrypt = require("bcrypt");

module.exports = (sequelize, DataType) => {
    var users = sequelize.define(
        "users",
        {
            u_id: {
                type: DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            first_name: {
                type: DataType.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            last_name: {
                type: DataType.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            email: {
                type: DataType.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            password: {
                type: DataType.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            account_status: {
                type: DataType.BOOLEAN,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
        },
        {
            hooks: {
                beforeCreate: async (users) => {
                    if (users.password) {
                        const salt = await bcrypt.genSaltSync(10, "a");
                        users.password = bcrypt.hashSync(users.password, salt);
                    }
                },

                /* beforeUpdate: async (users) => {
                    console.log(users);
                    if (users.password) {
                        const salt = await bcrypt.genSaltSync(10, "a");
                        users.password = bcrypt.hashSync(users.password, salt);
                    }
                }, */
            },
            instanceMethods: {
                validatePassword: (password) => {
                    return bcrypt.compareSync(password, this.password);
                },
            },
        }
    );
    users.prototype.validatePassword = async (password, hash) => {
        return await bcrypt.compareSync(password, hash);
    };
    users.associate = (models) => {
        users.belongsTo(models.roles, { foreignKey: "r_id" });
    };

    return users;
};
