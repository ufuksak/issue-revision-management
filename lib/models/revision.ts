"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Revision extends Model {}

  Revision.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      state: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      issueId: {
        type: DataTypes.INTEGER,
        field: "issue_id",
      },
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
      tableName: "revisions",
      sequelize,
      modelName: "Revision",
    }
  );
  return Revision;
};
