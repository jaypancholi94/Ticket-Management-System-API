module.exports = (sequelize, DataType) => {
    const roles = sequelize.define(
        "roles",
        {
            r_id: {
                type: DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataType.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            description: {
                type: DataType.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            permissions: {
                type: DataType.JSON,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            can_delete: {
                type: DataType.BOOLEAN,
            },
        },
        {}
    );
    roles.associate = (models) => {
        roles.hasOne(models.users, { foreignKey: "r_id" });
    };
    return roles;
};
