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
    type: DataType.BIGINT,
  })
  lastLogin: number;

  @Default('common')
  @Column
  serviceName!: string;

  @Default(0)
  @Column
  internalServiceId!: number;
}
