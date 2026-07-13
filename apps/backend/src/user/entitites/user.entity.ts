import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryColumn()
  id: string;
  @Column({ nullable: false })
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  avatar: string;
  @Column()
  role: string;
  @Column()
  status: string;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
}
