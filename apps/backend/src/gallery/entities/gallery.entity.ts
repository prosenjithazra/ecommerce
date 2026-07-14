import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('gallery')
export class GalleryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  mediaUrl: string;

  @Column({ nullable: true })
  link: string;

  @Column({ default: 'image' }) // 'image' | 'video'
  mediaType: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
