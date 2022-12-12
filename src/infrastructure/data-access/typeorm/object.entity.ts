import { PermissionModel } from './permission.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'objects' })
export class ObjectModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
  })
  name: string;

  @OneToMany(() => PermissionModel, (permission) => permission.object)
  permissions: PermissionModel[];
}
