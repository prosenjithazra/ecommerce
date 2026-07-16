import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AboutEntity } from './entities/about.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AboutService implements OnModuleInit {
  constructor(
    @InjectRepository(AboutEntity)
    private readonly aboutRepository: Repository<AboutEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async onModuleInit() {
    await this.seedAbout();
  }

  private async seedAbout() {
    try {
      const existing = await this.aboutRepository.findOne({
        where: { id: 'default' },
      });
      if (existing) return;

      const now = new Date();
      const about = new AboutEntity();
      about.id = 'default';
      about.badge = 'Our Story';
      about.title = 'We empower creators to bring designs to life.';
      about.story1 =
        'Founded with a passion for quality and design flexibility, Kliamo Fashion is a premium storefront. We reject low-grade sublimation and thin materials, offering only heavyweight cotton, durable stitching, and brilliant color direct-to-garment prints.';
      about.story2 =
        'Whether you are a solo artist looking to drop a new merchandise line, a corporate manager ordering uniform shirts, or simply designing a gift for a loved one, we print and deliver with absolute care.';
      about.image =
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80';
      about.missionTitle = 'Our Mission';
      about.missionDesc =
        'To provide the most intuitive, beautiful, and accessible customization experience online. We enable zero-minimum orders so that creative printing has no entry barriers.';
      about.visionTitle = 'Our Vision';
      about.visionDesc =
        'To become the leading globally sustainable customization ecosystem, utilizing strictly organic materials, biodegradable water-based inks, and automated carbon-neutral fulfillment logistics.';
      about.milestones = [
        {
          year: '2023',
          title: 'Company Scaffolding',
          desc: 'Kliamo Fashion was conceptualized with a single high-tech DTG printer in a small Brooklyn garage.',
        },
        {
          year: '2024',
          title: 'Interactive Canvas Designer Launch',
          desc: 'Built our bespoke real-time HTML canvas designer interface, facilitating drag-and-drop customization online.',
        },
        {
          year: '2025',
          title: 'Eco-Fulfillment Integration',
          desc: 'Switched all base blanks to certified organic cotton and recycled fleece fabrics.',
        },
        {
          year: '2026',
          title: 'Nationwide Scaling',
          desc: 'Opened three new fulfillment centers, lowering delivery turnarounds to less than 4 days.',
        },
      ];
      about.team = [
        {
          name: 'John Carter',
          role: 'CEO & Co-Founder',
          image:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        },
        {
          name: 'Sarah Vance',
          role: 'Lead Design Strategist',
          image:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
        },
        {
          name: 'David Kim',
          role: 'VP of Print Operations',
          image:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        },
      ];
      about.ctaTitle = 'Ready to wear your story?';
      about.ctaDesc =
        'Browse our premium print-ready collection and order with confidence — fast delivery, easy returns.';
      about.createdAt = now;
      about.updatedAt = now;

      await this.aboutRepository.save(about);
      console.log('Seeded default About Us content successfully.');
    } catch (err) {
      console.error('Error seeding About Us content:', err);
    }
  }

  async getAbout(): Promise<AboutEntity | null> {
    return this.aboutRepository.findOne({ where: { id: 'default' } });
  }

  async updateAbout(data: Partial<AboutEntity>): Promise<AboutEntity> {
    let about = await this.aboutRepository.findOne({
      where: { id: 'default' },
    });
    if (!about) {
      about = new AboutEntity();
      about.id = 'default';
      about.createdAt = new Date();
    }

    if (data.badge !== undefined) about.badge = data.badge;
    if (data.title !== undefined) about.title = data.title;
    if (data.story1 !== undefined) about.story1 = data.story1;
    if (data.story2 !== undefined) about.story2 = data.story2;

    // Cloudinary Story Image Upload
    if (data.image !== undefined) {
      if (data.image && data.image.startsWith('data:image/')) {
        about.image = await this.cloudinaryService.uploadImage(data.image);
      } else {
        about.image = data.image;
      }
    }

    if (data.missionTitle !== undefined) about.missionTitle = data.missionTitle;
    if (data.missionDesc !== undefined) about.missionDesc = data.missionDesc;
    if (data.visionTitle !== undefined) about.visionTitle = data.visionTitle;
    if (data.visionDesc !== undefined) about.visionDesc = data.visionDesc;
    if (data.milestones !== undefined) about.milestones = data.milestones;

    // Cloudinary Team Avatar Image Uploads
    if (data.team !== undefined) {
      const updatedTeam: { name: string; role: string; image: string }[] = [];
      for (const member of data.team) {
        let avatarUrl = member.image;
        if (avatarUrl && avatarUrl.startsWith('data:image/')) {
          avatarUrl = await this.cloudinaryService.uploadImage(avatarUrl);
        }
        updatedTeam.push({
          name: member.name,
          role: member.role,
          image: avatarUrl,
        });
      }
      about.team = updatedTeam;
    }

    if (data.ctaTitle !== undefined) about.ctaTitle = data.ctaTitle;
    if (data.ctaDesc !== undefined) about.ctaDesc = data.ctaDesc;
    about.updatedAt = new Date();

    return this.aboutRepository.save(about);
  }
}
