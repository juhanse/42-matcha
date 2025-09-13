import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export type AuthLogin = {
	email: string;
	password: string;
};

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

	@Post("login")
	async login(@Body() body: AuthLogin) {
		return await this.authService.login({ authlogin: body });
	}

	@Post("register")
	async register(@Body() body: CreateUserDto) {
		return await this.authService.register({ authregister: body });
	}
}
