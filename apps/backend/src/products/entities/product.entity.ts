import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'double precision', nullable: false })
  price: number;

  @Column({ type: 'double precision', nullable: false })
  originalPrice: number;

  @Column({ type: 'double precision', default: 5.0 })
  rating: number;

  @Column({ type: 'integer', default: 0 })
  reviewsCount: number;

  @Column({ nullable: false })
  image: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ nullable: false })
  category: string;

  @Column({ nullable: true })
  tag: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  colors: { name: string; hex: string }[];

  @Column({ type: 'json', nullable: true })
  sizes: string[];

  @Column({ default: true })
  inStock: boolean;

  @Column({ nullable: false, unique: true })
  sku: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
