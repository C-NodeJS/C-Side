import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class UserModel {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({
    nullable: false
  })
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({
    nullable: false
  })
  email: string;

  @Column({
    nullable: false
  })
  password: string;

  @Column({
    name: 'is_active',
    type: 'tinyint',
    width: 1,
    nullable: false
  })
  isActive: boolean;

  @Column()
  avatar: string;

  // TODO add role_id field later...
}
