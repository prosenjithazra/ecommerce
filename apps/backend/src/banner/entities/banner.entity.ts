import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('banner')
export class BannerEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ nullable: true })
  badge!: string;

  @Column({ nullable: false })
  headline1!: string;

  @Column({ nullable: false })
  headline2!: string;

  @Column({ nullable: true, default: '#F9A37E' })
  headline2Color!: string;

  @Column({ nullable: true })
  sub!: string;

  @Column({ nullable: true })
  productImg!: string;

  @Column({ nullable: true })
  bgImg?: string;

  @Column({ nullable: true })
  headline1Color?: string;

  @Column({ nullable: true })
  subColor?: string;

  @Column({ nullable: true })
  badgeColor?: string;

  @Column({ nullable: true, default: '#000000' })
  overlayColor?: string;

  @Column({ nullable: true, default: '#E8E2D6' })
  bg!: string;

  @Column({ nullable: true, default: '#F9A37E' })
  accent!: string;

  @Column({ default: true })
  textDark!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'json', nullable: true })
  badges?: { icon: string; label: string }[] | null;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;
}
