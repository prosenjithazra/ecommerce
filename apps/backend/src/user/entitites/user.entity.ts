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
  @Column({ nullable: true })
  avatar?: string;
  @Column({ nullable: true })
  phone?: string;
  @Column({ type: 'json', nullable: true })
  addresses?: any[];
  @Column({ type: 'json', nullable: true })
  preferences?: any;
  @Column()
  role: string;
  @Column()
  status: string;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
  @Column({ nullable: true })
  otpCode?: string;
  @Column({ nullable: true })
  otpExpiry?: Date;
  @Column({ nullable: true, default: 0 })
  otpAttempts?: number;
}

