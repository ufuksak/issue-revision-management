module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    // Add new table
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add new column to existing table
    await queryInterface.addColumn("Users", "address", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface: any, _Sequelize: any) => {
    // Revert changes in reverse order
    await queryInterface.removeColumn("Users", "address");

    await queryInterface.dropTable("Users");
  },
};
