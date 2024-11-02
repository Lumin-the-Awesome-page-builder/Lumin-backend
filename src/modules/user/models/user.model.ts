import {
  AutoIncrement,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

// @ts-ignore
@Table({ tableName: 'users' })
export class UserModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  login: string;

  @Column
  hash: string;

  @Column({
    field: 'lastlogin',
    type: DataType.BIGINT,
  })
  lastLogin: number;

  @Default('common')
  @Column({
    field: 'servicename',
  })
  serviceName!: string;

  @Default(0)
  @Column({
    field: 'internalserviceid',
  })
  internalServiceId!: number;

  @Column({
    field: "createdat",
    type: DataType.DATE,
  })
  createdAt?: Date | any;

  @Column({
    field: "updatedat",
    type: DataType.DATE,
  })
  updatedAt?: Date | any;
}
