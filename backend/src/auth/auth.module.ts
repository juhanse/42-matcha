import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DbModule } from 'src/db/db.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../../../.env') });

@Module({
	imports: [
		DbModule,
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '365d' },
		}),
	],
	controllers: [AuthController],
	providers: [JwtStrategy, AuthService]
})
export class AuthModule {}
