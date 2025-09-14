import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	@IsEmail({}, { message: 'Invalid email format' })
	email: string;

	@IsOptional()
	@IsString()
	@MinLength(4, { message: 'Username must be at least 4 characters long' })
	username: string;

	@IsOptional()
	@IsString()
	@MinLength(2, { message: 'Lastname must be at least 2 characters long' })
	lastname: string;

	@IsOptional()
	@IsString()
	@MinLength(2, { message: 'Firstname must be at least 2 characters long' })
	firstname: string;

	@IsOptional()
	@IsString()
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	password: string;
}
