import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';
import { compare, hash } from 'bcrypt';
import { UserPayload } from './jwt.strategy';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PG_POOL } from 'src/db/db.module';

@Injectable()
export class AuthService {
	constructor(@Inject(PG_POOL) private readonly pool: Pool, private readonly jwtService: JwtService) {}

	async login({ username, password }: LoginDto) {
		const query = 'SELECT * FROM users WHERE username = $1';
		const result = await this.pool.query(query, [username]);

		if (!result.rows[0]) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		const isPasswordValid = await this.isPasswordValid({ password, hashedPassword: result.rows[0].password });
		if (!isPasswordValid) {
			throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
		}

		return this.authenticateUser({ id: result.rows[0].id });
	}

	async register({ email, username, lastname, firstname, password }: RegisterDto) {
		const searchQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
		const existingUser = await this.pool.query(searchQuery, [username, email]);

		if (existingUser.rows[0]) {
			throw new HttpException('User existing', HttpStatus.INTERNAL_SERVER_ERROR);
		}

		const hashedPassword = await this.hashPassword({ password });

		const createQuery = `
			INSERT INTO users (email, username, lastname, firstname, password)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, username, email
		`;
		const user = await this.pool.query(createQuery, [email, username, lastname, firstname, hashedPassword]);

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
