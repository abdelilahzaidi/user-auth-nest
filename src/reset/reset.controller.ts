import { IsEmail } from 'class-validator';
import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Post,
  forwardRef,
} from '@nestjs/common';
import { ResetService } from './reset.service';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthService } from 'src/auth/auth.service';
import { Reset } from './reser.interface';
import * as bcrypt from 'bcrypt';

@Controller()
export class ResetController {
  constructor(
    private resetService: ResetService,
    private mailerService: MailerService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  @Post('forgot')
  async forgot(@Body('email') email: string) {
    const token = Math.random().toString(20).substring(2, 12);

    await this.resetService.create({
      email,
      token,
    });

    const url = `http://localhost:4200/reset/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      html: `Click <a href="${url}">here</a> to reset your password!`,
    });

    return {
      message: 'Check your password',
    };
  }

  @Post('reset')
  async reset(
    @Body('token') token: string,
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
  ) {
    if (password !== password_confirm) {
      throw new BadRequestException('Passwords do not match!!!');
    }

    const reset = await this.resetService.findOneByToken(token);

    if (!reset) {
      throw new NotFoundException('Reset request not found!');
    }

    const email = reset.email;

    const user = await this.authService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
      throw new InternalServerErrorException('Failed to hash the password');
    }

    try {
      await this.authService.update(user.id, hashedPassword);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update the password');
    }

    return {
      message: 'Success!!!',
    };
  }
}
