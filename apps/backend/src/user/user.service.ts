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
import { GoogleAuthDto } from './dto/google-auth.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class UserService implements OnModuleInit {
  // Temporary in-memory store for signup OTPs (email → { otp, expiry })
  private signupOtpStore = new Map<string, { otp: string; expiry: Date }>();

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly emailService: EmailService,
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
    const email = dto?.email ? dto.email.trim().toLowerCase() : '';
    if (!email) {
      throw new ConflictException('Email address is required');
    }

    const existing = await this.userRepository.findOne({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password || 'password123', 10);
    const now = new Date();

    const user = new UserEntity();
    user.id = randomUUID();
    user.name = dto.name || 'User';
    user.email = email;
    user.password = hashedPassword;
    user.avatar = dto.avatar || '';
    user.phone = dto.phone || '';
    user.role = dto.role || 'user';
    user.status = dto.status || 'Active';
    user.createdAt = now;
    user.updatedAt = now;

    await this.userRepository.save(user);

    // Send welcome email via Nodemailer asynchronously
    this.emailService.sendWelcomeEmail(user.email, user.name).catch((err) => {
      console.error('Error sending welcome email asynchronously:', err);
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async login(
    dto: LoginDto,
  ): Promise<{ token: string; user: Omit<UserEntity, 'password'> }> {
    const email = dto?.email ? dto.email.trim().toLowerCase() : '';
    if (!email) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== 'Active') {
      throw new UnauthorizedException('Account is suspended or inactive');
    }

    const isMatch = await bcrypt.compare(dto.password || '', user.password);
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

  async googleAuth(
    dto: GoogleAuthDto,
  ): Promise<{ token: string; user: Omit<UserEntity, 'password'> }> {
    let email = dto?.email ? dto.email.trim().toLowerCase() : '';
    let name = dto?.name;
    let avatar = dto?.avatar;

    if (dto.credential) {
      try {
        const decoded = jwt.decode(dto.credential) as any;
        if (decoded && decoded.email) {
          email = decoded.email.toLowerCase();
          name = name || decoded.name || decoded.given_name;
          avatar = avatar || decoded.picture;
        }
      } catch (err) {
        console.warn('Could not decode Google credential token:', err);
      }
    }

    if (!email) {
      throw new UnauthorizedException('Invalid Google authentication credentials');
    }

    let user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      if (user.status !== 'Active') {
        throw new UnauthorizedException('Account is suspended or inactive');
      }

      // Update avatar or name if provided and missing
      let updated = false;
      if (avatar && !user.avatar) {
        user.avatar = avatar;
        updated = true;
      }
      if (name && (!user.name || user.name === 'User')) {
        user.name = name;
        updated = true;
      }
      if (updated) {
        user.updatedAt = new Date();
        await this.userRepository.save(user);
      }
    } else {
      // Register new user via Google
      const hashedPassword = await bcrypt.hash(randomUUID(), 10);
      const now = new Date();

      user = new UserEntity();
      user.id = randomUUID();
      user.name = name || email.split('@')[0] || 'User';
      user.email = email;
      user.password = hashedPassword;
      user.avatar = avatar || '';
      user.phone = dto.phone || '';
      user.role = 'user';
      user.status = 'Active';
      user.createdAt = now;
      user.updatedAt = now;

      await this.userRepository.save(user);

      // Send welcome email asynchronously
      this.emailService.sendWelcomeEmail(user.email, user.name).catch((err) => {
        console.error('Error sending welcome email for Google user:', err);
      });
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

  async forgotPassword(email: string): Promise<{ message: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findOne({ where: { email: normalizedEmail } });

    // Always return success to avoid email enumeration attacks
    if (!user || user.status !== 'Active') {
      return { message: 'If this email is registered, you will receive an OTP shortly.' };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otpCode = otp;
    user.otpExpiry = expiry;
    user.otpAttempts = 0;
    user.updatedAt = new Date();
    await this.userRepository.save(user);

    // Send OTP email
    this.emailService.sendOtpEmail(user.email, user.name, otp).catch((err) => {
      console.error('Error sending OTP email:', err);
    });

    return { message: 'If this email is registered, you will receive an OTP shortly.' };
  }

  async verifyOtp(email: string, otp: string): Promise<{ valid: boolean; message: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findOne({ where: { email: normalizedEmail } });

    if (!user || !user.otpCode || !user.otpExpiry) {
      throw new UnauthorizedException('No active OTP found. Please request a new one.');
    }

    // Check attempts (max 5)
    if ((user.otpAttempts || 0) >= 5) {
      user.otpCode = undefined;
      user.otpExpiry = undefined;
      user.otpAttempts = 0;
      await this.userRepository.save(user);
      throw new UnauthorizedException('Too many failed attempts. Please request a new OTP.');
    }

    // Check expiry
    if (new Date() > user.otpExpiry) {
      user.otpCode = undefined;
      user.otpExpiry = undefined;
      user.otpAttempts = 0;
      await this.userRepository.save(user);
      throw new UnauthorizedException('OTP has expired. Please request a new one.');
    }

    // Check code
    if (user.otpCode !== otp.trim()) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      await this.userRepository.save(user);
      const remaining = 5 - (user.otpAttempts || 0);
      throw new UnauthorizedException(`Invalid OTP. ${remaining} attempt(s) remaining.`);
    }

    // OTP valid — mark as verified (keep code for reset step)
    user.otpAttempts = 0;
    await this.userRepository.save(user);

    return { valid: true, message: 'OTP verified successfully.' };
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ success: boolean }> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findOne({ where: { email: normalizedEmail } });

    if (!user || !user.otpCode || !user.otpExpiry) {
      throw new UnauthorizedException('No active OTP session found. Please start over.');
    }

    if (new Date() > user.otpExpiry) {
      user.otpCode = undefined;
      user.otpExpiry = undefined;
      await this.userRepository.save(user);
      throw new UnauthorizedException('OTP has expired. Please request a new one.');
    }

    if (user.otpCode !== otp.trim()) {
      throw new UnauthorizedException('Invalid OTP. Please verify your code first.');
    }

    if (!newPassword || newPassword.length < 8) {
      throw new UnauthorizedException('Password must be at least 8 characters.');
    }

    // Reset password and clear OTP
    user.password = await bcrypt.hash(newPassword, 10);
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    user.otpAttempts = 0;
    user.updatedAt = new Date();
    await this.userRepository.save(user);

    return { success: true };
  }

  async sendSignupOtp(email: string): Promise<{ message: string }> {
    const normalizedEmail = email.trim().toLowerCase();

    // Check email not already registered
    const existing = await this.userRepository.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      throw new ConflictException('This email is already registered. Please login instead.');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    this.signupOtpStore.set(normalizedEmail, { otp, expiry });

    // Send OTP email (find a placeholder name from the email prefix)
    const name = normalizedEmail.split('@')[0] || 'User';
    this.emailService.sendOtpEmail(normalizedEmail, name, otp).catch((err) => {
      console.error('Error sending signup OTP email:', err);
    });

    return { message: 'OTP sent to your email. It expires in 10 minutes.' };
  }

  async verifySignupOtp(email: string, otp: string): Promise<{ valid: boolean; message: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const entry = this.signupOtpStore.get(normalizedEmail);

    if (!entry) {
      throw new UnauthorizedException('No active OTP found. Please request a new one.');
    }

    if (new Date() > entry.expiry) {
      this.signupOtpStore.delete(normalizedEmail);
      throw new UnauthorizedException('OTP has expired. Please request a new one.');
    }

    if (entry.otp !== otp.trim()) {
      throw new UnauthorizedException('Invalid OTP. Please check and try again.');
    }

    // OTP valid — remove from store
    this.signupOtpStore.delete(normalizedEmail);
    return { valid: true, message: 'OTP verified successfully.' };
  }
}

