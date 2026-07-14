import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('order')
export class OrderEntity {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  customer: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  date: string;

  @Column({ type: 'integer', default: 1 })
  items: number;

  @Column({ type: 'double precision', nullable: false })
  total: number;

  @Column({ default: 'Pending' })
  status: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
