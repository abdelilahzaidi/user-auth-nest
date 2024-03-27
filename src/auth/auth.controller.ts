import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { AuthInterceptor } from './auth.interceptor';


@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const saltOrRounds = 10;
    const password = body.password;
    const hash = await bcrypt.hash(password, saltOrRounds);

    if (body.password !== body.password_confirm) {
      throw new BadRequestException('Password do not match!!');
    }
    return this.authService.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: hash,
    });
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.findOneByEmail(email);
    console.log('user', user);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('is', user.password);
    //If user does not exist
    if (!user) {
      throw new BadRequestException('Email does not exists!');
    }
    // Vérifier si le mot de passe est null dans l'utilisateur (ce qui ne devrait pas arriver)
    if (!user.password) {
      throw new InternalServerErrorException('User password is null!');
    }

    if (!isMatch) {
      throw new BadRequestException('invalids credentials!');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true });
    return { user, jwt };
  }
  @UseInterceptors(AuthInterceptor)
  @Get('user')
  async user(@Req() request: Request) {
    const cookie = await request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    const user = await this.authService.findOneBy({
      where: { id: data['id'] },
    });
    console.log('data', data['id']);
    return {
      user,
    };
  }

  @UseInterceptors(AuthInterceptor)
  @Post('logout')
  async logout(
    @Res({passthrough:true}) response : Response
  ){
    response.clearCookie('jwt')
    return {
      message : 'Success'
    }
  }
}
