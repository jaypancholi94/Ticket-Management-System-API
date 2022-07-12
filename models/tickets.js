module.exports = (sequelize, DataType) => {
    const tickets = sequelize.define(
        "tickets",
        {
            t_id: {
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
            status: {
                type: DataType.JSON,
            },
        },
        {}
    );
    tickets.associate = (models) => {
        tickets.belongsTo(models.boards, { foreignKey: "b_id" });
        tickets.belongsTo(models.users, {
            foreignKey: "owner_id",
            as: "owner",
        });
    };
    return tickets;
};
