import { Pool } from 'pg';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../../../.env') });

export class DB {
  	private static pool: Pool;

	static init() {
		if (!this.pool) {
			this.pool = new Pool({
				host: process.env.DB_HOST,
				port: Number(process.env.DB_PORT),
				user: process.env.DB_USER,
				password: process.env.DB_PASSWORD,
				database: process.env.DB_NAME,
			});
		}
		return this.pool;
	}

	static async query<T = any>(text: string, params?: any[]): Promise<T[]> {
		const pool = this.init();
		const result = await pool.query(text, params);

		return result.rows;
	}
}
