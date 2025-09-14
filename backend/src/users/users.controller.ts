import { Controller, UseGuards, Body, Get, Request, Patch, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import type { RequestUser } from 'src/auth/jwt.strategy';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('me')
	getMe(@Request() req: RequestUser) {
		return this.usersService.getUser({ id: req.user.id });
	}

	@Patch('me')
	updateMe(@Request() req: RequestUser, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.updateUser({ id: req.user.id } , updateUserDto);
	}

	@Delete('me')
	deleteMe(@Request() req: RequestUser) {
		return this.usersService.deleteUser({ id: req.user.id });
	}
}
