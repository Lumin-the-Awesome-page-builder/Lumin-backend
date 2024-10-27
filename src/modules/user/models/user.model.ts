import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

// @ts-ignore
@Table()
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
}
