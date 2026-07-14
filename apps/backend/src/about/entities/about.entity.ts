import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('about')
export class AboutEntity {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false, default: 'Our Story' })
  badge: string;

  @Column({
    nullable: false,
    default: 'We empower creators to bring designs to life.',
  })
  title: string;

  @Column({ type: 'text', nullable: false })
  story1: string;

  @Column({ type: 'text', nullable: false })
  story2: string;

  @Column({ nullable: false })
  image: string;

  @Column({ nullable: false, default: 'Our Mission' })
  missionTitle: string;

  @Column({ type: 'text', nullable: false })
  missionDesc: string;

  @Column({ nullable: false, default: 'Our Vision' })
  visionTitle: string;

  @Column({ type: 'text', nullable: false })
  visionDesc: string;

  @Column({ type: 'json', nullable: true })
  milestones: { year: string; title: string; desc: string }[];

  @Column({ type: 'json', nullable: true })
  team: { name: string; role: string; image: string }[];

  @Column({ nullable: false })
  ctaTitle: string;

  @Column({ type: 'text', nullable: false })
  ctaDesc: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
