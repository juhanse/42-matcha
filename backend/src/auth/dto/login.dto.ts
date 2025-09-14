import { IsString, MinLength } from 'class-validator';

export class LoginDto {
	@IsString()
	@MinLength(4, { message: 'Username must be at least 4 characters long' })
	username: string;

	@IsString()
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	password: string;
}
