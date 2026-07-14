import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('settings')
export class SettingsEntity {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false, default: 'support@kaivafashion.com' })
  email: string;

  @Column({ nullable: false, default: '+1 555-0199' })
  phone: string;

  @Column({ nullable: false, default: '123 Creative St, New York, NY 10001' })
  address: string;

  @Column({ nullable: false, default: 'Mon - Fri, 9am - 6pm EST' })
  hours: string;

  @Column({ nullable: false, default: 'https://twitter.com/kaiva' })
  twitterUrl: string;

  @Column({ nullable: false, default: 'https://instagram.com/kaiva' })
  instagramUrl: string;

  @Column({ nullable: false, default: 'https://facebook.com/kaiva' })
  facebookUrl: string;

  @Column({ nullable: true })
  updatedAt: Date;
}
