import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
	@IsNotEmpty()
	@IsString()
	@IsEmail({}, { message: 'Invalid email format' })
	email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(4, { message: 'Username must be at least 4 characters long' })
	username: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(2, { message: 'Lastname must be at least 2 characters long' })
	lastname: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(2, { message: 'Firstname must be at least 2 characters long' })
	firstname: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	password: string;
}
