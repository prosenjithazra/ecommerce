import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { AuthGuard } from './auth.guard';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Post('google-auth')
  async googleAuth(@Body() googleAuthDto: GoogleAuthDto) {
    return this.userService.googleAuth(googleAuthDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    return this.userService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Put('profile/update')
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateDto: Partial<CreateUserDto>,
  ) {
    return this.userService.updateProfile(req.user.id, updateDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Put(':id/status')
  async toggleStatus(@Param('id') id: string) {
    return this.userService.toggleStatus(id);
  }

  @UseGuards(AuthGuard)
  @Put('profile/change-password')
  async changePassword(@Request() req: RequestWithUser, @Body() body: any) {
    return this.userService.changePassword(req.user.id, body.current, body.new);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.userService.forgotPassword(body.email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    return this.userService.verifyOtp(body.email, body.otp);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; otp: string; newPassword: string }) {
    return this.userService.resetPassword(body.email, body.otp, body.newPassword);
  }

  @Post('send-signup-otp')
  async sendSignupOtp(@Body() body: { email: string }) {
    return this.userService.sendSignupOtp(body.email);
  }

  @Post('verify-signup-otp')
  async verifySignupOtp(@Body() body: { email: string; otp: string }) {
    return this.userService.verifySignupOtp(body.email, body.otp);
  }
}


