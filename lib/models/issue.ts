"use strict";

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Model'.
const { Model, DataTypes } = require("sequelize");

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (sequelize: any) => {
    class Issue extends Model {
    }
    (Issue as any).init({
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
    }, {
        timestamps: true,
        updatedAt: "updated_at",
        createdAt: "created_at",
        tableName: "issues",
        sequelize,
        modelName: "Issues",
    });
    return Issue;
};
