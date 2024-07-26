"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Issue extends Model {}

  Issue.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      created_by: {
        type: DataTypes.STRING,
        defaultValue: "unknown",
      },
      updated_by: {
        type: DataTypes.STRING,
        defaultValue: "unknown",
      },
    },
    {
      timestamps: true,
      updatedAt: "updated_at",
      createdAt: "created_at",
      tableName: "issues",
      sequelize,
      modelName: "Issues",
    }
  );
  return Issue;
};
