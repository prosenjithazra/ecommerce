import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entitites/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  async seedAdminUser() {
    try {
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
      const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

      if (!adminEmail || !adminPassword) {
        return;
      }

      let user = await this.userRepository.findOne({
        where: { id: 'admin-default-uuid-1111' },
      });

      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const now = new Date();

      if (!user) {
        // Prevent duplicate keys if user already exists under different ID
        const emailExists = await this.userRepository.findOne({
          where: { email: adminEmail.toLowerCase() },
        });
        if (emailExists) {
          emailExists.role = 'admin';
          const isPasswordMatch = await bcrypt.compare(
            adminPassword,
            emailExists.password,
          );
          if (!isPasswordMatch) {
            emailExists.password = hashedPassword;
          }
          await this.userRepository.save(emailExists);
          console.log(`Updated existing user to admin: ${adminEmail}`);
          return;
        }

        user = new UserEntity();
        user.id = 'admin-default-uuid-1111';
        user.name = 'Administrator';
        user.email = adminEmail.toLowerCase();
        user.password = hashedPassword;
        user.avatar = '';
        user.role = 'admin';
        user.status = 'Active';
        user.createdAt = now;
        user.updatedAt = now;
        await this.userRepository.save(user);
        console.log(
          `Seeded default admin user from environment: ${adminEmail}`,
        );
      } else {
        const isPasswordMatch = await bcrypt.compare(
          adminPassword,
          user.password,
        );
        if (user.email !== adminEmail.toLowerCase() || !isPasswordMatch) {
          user.email = adminEmail.toLowerCase();
          user.password = hashedPassword;
          user.updatedAt = now;
          await this.userRepository.save(user);
          console.log(
            `Updated admin credentials in database from environment: ${adminEmail}`,
          );
        }
      }
    } catch (err) {
      console.error('Error seeding admin user:', err);
    }
  }

  async register(dto: CreateUserDto): Promise<Omit<UserEntity, 'password'>> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const now = new Date();

    const user = new UserEntity();
    user.id = randomUUID();
    user.name = dto.name;
    user.email = dto.email.toLowerCase();
    user.password = hashedPassword;
    user.avatar = dto.avatar || '';
    user.role = dto.role || 'user';
    user.status = dto.status || 'Active';
    user.createdAt = now;
    user.updatedAt = now;

    await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async login(
    dto: LoginDto,
  ): Promise<{ token: string; user: Omit<UserEntity, 'password'> }> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== 'Active') {
      throw new UnauthorizedException('Account is suspended or inactive');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const secret =
      this.configService.get<string>('JWT_SECRET') ||
      'printhub-super-secret-key-123';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '7d' },
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return { token, user: result };
  }

  async getProfile(userId: string): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async updateProfile(
    userId: string,
    dto: any,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.avatar !== undefined) {
      if (dto.avatar && dto.avatar.startsWith('data:image/')) {
        user.avatar = await this.cloudinaryService.uploadImage(dto.avatar);
      } else {
        user.avatar = dto.avatar;
      }
    }

    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.addresses !== undefined) user.addresses = dto.addresses;
    if (dto.preferences !== undefined) user.preferences = dto.preferences;

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    user.updatedAt = new Date();
    await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async findAll(): Promise<Omit<UserEntity, 'password'>[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
    return users.map(({ password, ...result }) => result);
  }

  async toggleStatus(id: string): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.status = user.status === 'Active' ? 'Suspended' : 'Active';
    user.updatedAt = new Date();
    await this.userRepository.save(user);
    const { password, ...result } = user;
    return result;
  }

  async changePassword(
    userId: string,
    currentPass: string,
    newPass: string,
  ): Promise<{ success: boolean }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Current password does not match');
    user.password = await bcrypt.hash(newPass, 10);
    user.updatedAt = new Date();
    await this.userRepository.save(user);
    return { success: true };
  }
}
