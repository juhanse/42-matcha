import { Module } from '@nestjs/common';
import { DB } from './db.service';

export const PG_POOL = 'PG_POOL';

@Module({
	providers: [
		{
			provide: PG_POOL,
			useFactory: () => DB.init(),
		},
	],
	exports: [PG_POOL],
})
export class DbModule {}
