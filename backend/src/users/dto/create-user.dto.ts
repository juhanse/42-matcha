import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	username: string;

	@IsNotEmpty()
	@IsEmail({}, { message: 'Invalid email format' })
	email: string;

	@IsNotEmpty()
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	password: string;
}
