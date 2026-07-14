import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('newsletter')
export class NewsletterEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'Active' })
  status: string;

  @Column()
  subscribedAt: Date;
}
