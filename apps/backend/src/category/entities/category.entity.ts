import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('category')
export class CategoryEntity {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ default: 0 })
  count: number;

  @Column({ nullable: false, unique: true })
  slug: string;

  @Column({ nullable: false })
  image: string;

  @Column({ default: 'Active' })
  status: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
