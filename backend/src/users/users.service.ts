import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from 'src/db/db.module';
import { hash } from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
	constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

	async getUser({ id }: { id: string }) {
		const { rows } = await this.pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);

		if (!rows[0]) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		return rows[0];
	}

	async updateUser({ id }: { id: string }, updateUserDto: UpdateUserDto) {
		const { password, ...rest } = updateUserDto;
		const dataToUpdate: any = { ...rest };

		if (password) {
			const hashedPassword = await hash(password, 10);
			dataToUpdate.password_hash = hashedPassword;
		}

		const { rows } = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
		if (!rows[0]) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		const user = rows[0];
		const updatedAt = new Date();

		const values = [
			dataToUpdate.email ?? user.email,
			dataToUpdate.username ?? user.username,
			dataToUpdate.lastname ?? user.lastname,
			dataToUpdate.firstname ?? user.firstname,
			dataToUpdate.password_hash ?? user.password,
			updatedAt,
			id
		];

		const query = `UPDATE users SET email = $1, username = $2, lastname = $3, firstname = $4, password = $5, updated_at = $6 WHERE id = $7 RETURNING *`;
		const result = await this.pool.query(query, values);

		return result.rows[0];
	}

	async deleteUser({ id }: { id: string }) {
		const isExist = await this.pool.query('SELECT id FROM users WHERE id = $1', [id]);
		if (!isExist.rows[0]) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		const query = `DELETE FROM users WHERE id = $1 RETURNING id, email, name, created_at, updated_at`;
		await this.pool.query(query, [id]);

		return { message: 'User deleted successfully.' };
	}
}
