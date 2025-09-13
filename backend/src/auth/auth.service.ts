import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';
import { AuthLogin } from './auth.controller';
import { compare, hash } from 'bcrypt';
import { UserPayload } from './jwt.strategy';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
	constructor(@Inject('PG_POOL') private pool: Pool, private readonly jwtService: JwtService) {}

	async login({ authlogin }: { authlogin: AuthLogin }) {
		const { email, password } = authlogin;

		const query = 'SELECT id, username, email FROM users WHERE id = $1';
		const result = await this.pool.query(query, [email]);

		if (!result.rows[0]) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		const isPasswordValid = await this.isPasswordValid({ password, hashedPassword: result.rows[0].password });
		if (!isPasswordValid) {
			throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
		}

		return this.authenticateUser({ id: result.rows[0].id });
	}

	async register({ authregister }: { authregister: CreateUserDto }) {
		const { username, email, password } = authregister;

		const searchQuery = 'SELECT id, username, email FROM users WHERE username = $1 OR email = $2';
		const existingUser = await this.pool.query(searchQuery, [username, email]);

		if (existingUser.rows[0]) {
			throw new HttpException('User existing', HttpStatus.INTERNAL_SERVER_ERROR);
		}

		const hashedPassword = await this.hashPassword({ password });

		const createQuery = `
			INSERT INTO users (username, email, password)
			VALUES ($1, $2, $3)
			RETURNING id, username, email
		`;
		const user = await this.pool.query(createQuery, [username, email, hashedPassword]);

		if (!user.rows[0]) {
			throw new HttpException('Failed creating user', HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return this.authenticateUser({ id: user.rows[0].id });
	}

	private async hashPassword({ password }: { password: string }) {
		const hashPassword = await hash(password, 10);
	
		return hashPassword;
	}

	private async isPasswordValid({ password, hashedPassword }: { password: string, hashedPassword: string }) {
		const isPasswordValid = await compare(password, hashedPassword);
	
		return isPasswordValid;
	}

	private authenticateUser({ id }: UserPayload) {
		const payload: UserPayload = { id };
	
		return { access_token: this.jwtService.sign(payload) }
	}
}
