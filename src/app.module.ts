import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetModule } from './reset/reset.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Zah14$01471983',
      database: 'authnest',
      entities: [],
      autoLoadEntities:true,
      synchronize: true,
    }),
    AuthModule,
    ResetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
