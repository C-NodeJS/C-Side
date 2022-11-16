import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class UserModel {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({
    nullable: false
  })
  name: string;

  @Column({
    nullable: true
    }
  )
  address?: string;

  @Column({
    nullable: true
  })
  phone?: string;

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
    type: 'smallint',
    width: 1,
    nullable: true
  })
  isActive?: number;

  @Column({
    nullable: true
  })
  avatar?: string;

  // TODO add role_id field later...
}
