import { Column, CreatedAt, HasMany, Model, Table, UpdatedAt} from 'sequelize-typescript';
import { Revision } from "./revisionnew";
import {DataTypes} from "sequelize";

@Table({ tableName: 'issues', timestamps: true, modelName: "Issues" })
export class Issue extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    })
    id!: number;

    @Column({ type: DataTypes.STRING })
    title!: string;

    @Column({ type: DataTypes.STRING })
    description!: string;

    @Column({ field: 'created_by', type: DataTypes.STRING, defaultValue: "unknown" })
    createdBy: string | undefined;

    @Column({ field: 'updated_by', type: DataTypes.STRING, defaultValue: "unknown" })
    updatedBy: string | undefined;

    @Column({ field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW })
    @CreatedAt
    createdAt!: Date;

    @Column({ field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW })
    @UpdatedAt
    updatedAt: Date | undefined;

    @HasMany(() => Revision)
    revision: Revision[] | undefined;
}
