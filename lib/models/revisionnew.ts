import { Issue } from './issuenew';
import { BelongsTo, Column, CreatedAt, ForeignKey, Model, Table, UpdatedAt} from 'sequelize-typescript';
import {DataTypes} from "sequelize";

@Table({ tableName: 'revisions', timestamps: true, modelName: "Revisions" })
export class Revision extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
    })
    id!: number;

    @Column({ type: DataTypes.STRING })
    state!: string;

    @Column({ type: DataTypes.STRING })
    title!: string;

    @Column({ type: DataTypes.STRING })
    description!: string;

    @BelongsTo(() => Issue)
    issue: Issue | undefined;

    @ForeignKey(() => Issue)
    @Column({ field: 'issue_id', type: DataTypes.INTEGER })
    issueId: number | undefined;

    @Column({ field: 'created_by', type: DataTypes.STRING, defaultValue: "unknown" })
    createdBy: string | undefined;

    @Column({ field: 'updated_by', type: DataTypes.STRING, defaultValue: "unknown" })
    updatedBy: string | undefined;

    @Column({ field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW })
    @CreatedAt
    createdAt!: Date;

    @Column({ field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW })
    @UpdatedAt
    updatedAt!: Date;
}
