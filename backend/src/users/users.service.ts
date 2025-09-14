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

		const isExist = await this.pool.query('SELECT id FROM users WHERE id = $1', [id]);
		if (!isExist.rows[0]) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		dataToUpdate.updated_at = new Date();
	
		const query = `UPDATE users SET email = $1, name = $2, updated_at = NOW() WHERE id = $3 RETURNING id, email, name, created_at, updated_at`;
		const values = [dataToUpdate.email, dataToUpdate.name, id];
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
