module.exports = (sequelize, DataType) => {
    const boards = sequelize.define(
        "boards",
        {
            b_id: {
                type: DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
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
        },
        {}
    );

    boards.associate = (models) => {
        boards.belongsTo(models.users, { foreignKey: "owner_id", as: "owner" });
    };
    return boards;
};
