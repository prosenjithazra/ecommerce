import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contact')
export class ContactEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  subject?: string;

  @Column({ type: 'text', nullable: false })
  message: string;

  @Column({ default: 'Pending' })
  status: string;

  @Column()
  createdAt: Date;
}
