import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { About, AboutDocument } from './schemas/about.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AboutService implements OnModuleInit {
  constructor(
    @InjectModel(About.name)
    private readonly aboutModel: Model<AboutDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async onModuleInit() {
    await this.seedAbout();
  }

  private async seedAbout() {
    try {
      const existing = await this.aboutModel.findOne({ id: 'default' });
      if (existing) return;

      const now = new Date();
      const about = new this.aboutModel({
        id: 'default',
        badge: 'Our Story',
        title: 'We empower creators to bring designs to life.',
        story1:
          'Founded with a passion for quality and design flexibility, Kliamo Fashion is a premium storefront. We reject low-grade sublimation and thin materials, offering only heavyweight cotton, durable stitching, and brilliant color direct-to-garment prints.',
        story2:
          'Whether you are a solo artist looking to drop a new merchandise line, a corporate manager ordering uniform shirts, or simply designing a gift for a loved one, we print and deliver with absolute care.',
        image:
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
        missionTitle: 'Our Mission',
        missionDesc:
          'To provide the most intuitive, beautiful, and accessible customization experience online. We enable zero-minimum orders so that creative printing has no entry barriers.',
        visionTitle: 'Our Vision',
        visionDesc:
          'To become the leading globally sustainable customization ecosystem, utilizing strictly organic materials, biodegradable water-based inks, and automated carbon-neutral fulfillment logistics.',
        milestones: [
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
        ],
        team: [
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
        ],
        ctaTitle: 'Ready to wear your story?',
        ctaDesc:
          'Browse our premium print-ready collection and order with confidence — fast delivery, easy returns.',
        createdAt: now,
        updatedAt: now,
      });

      await about.save();
      console.log('Seeded default About Us content successfully.');
    } catch (err) {
      console.error('Error seeding About Us content:', err);
    }
  }

  async getAbout(): Promise<About | null> {
    return this.aboutModel.findOne({ id: 'default' });
  }

  async updateAbout(data: Partial<About>): Promise<About> {
    let about = await this.aboutModel.findOne({ id: 'default' });
    if (!about) {
      about = new this.aboutModel({
        id: 'default',
        createdAt: new Date(),
      });
    }

    if (data.badge !== undefined) about.badge = data.badge;
    if (data.title !== undefined) about.title = data.title;
    if (data.story1 !== undefined) about.story1 = data.story1;
    if (data.story2 !== undefined) about.story2 = data.story2;

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

    return about.save();
  }
}
