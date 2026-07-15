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

  @Column({ type: 'json', nullable: true })
  itemsJson: any;

  @Column({ type: 'varchar', nullable: true })
  paymentMethod: string | null;

  @Column({ type: 'varchar', nullable: true })
  paymentId: string | null;

  @Column({ type: 'varchar', nullable: true })
  paymentStatus: string | null;

  @Column({ type: 'varchar', nullable: true })
  cancelReason: string | null;

  @Column({ type: 'varchar', nullable: true })
  returnReason: string | null;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
