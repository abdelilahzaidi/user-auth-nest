import { Module } from '@nestjs/common';
import { ResetService } from './reset.service';
import { ResetController } from './reset.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetEntity } from './reset.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResetEntity]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 3000,
      },
      defaults : {
        from : 'no-replay@localhost.com'
      }
    }),
  ],
  providers: [ResetService],
  controllers: [ResetController],
})
export class ResetModule {}
