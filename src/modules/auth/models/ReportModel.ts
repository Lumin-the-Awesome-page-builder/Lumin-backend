import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

// @ts-ignore
@Table({ tableName: 'reports' })
export class ReportModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  errorType: string;

  @Column({
    field: 'message',
    type: DataType.TEXT,
  })
  message?: any;

  @Column
  errorCode: string;

  @Column
  userAgent: string;

  @Column
  url: string;

  @Column({
    field: 'stack',
    type: DataType.TEXT,
  })
  stack?: any;

  @Column({
    field: 'createdat',
    type: DataType.DATE,
  })
  createdAt?: Date | any;
}
