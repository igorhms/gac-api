import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { FinanceModule } from './modules/finance/finance.module';
import { AccountModule } from './modules/account/account.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '60m',
        },
      }),
      global: true,
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    FinanceModule,
    AccountModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
