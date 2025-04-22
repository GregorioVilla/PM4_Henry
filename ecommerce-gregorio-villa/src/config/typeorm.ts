import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { User } from 'src/users/entities/user-entity';
import { Orders } from 'src/orders/entities/order.entity';
import { Categories } from 'src/categories/entities/category.entity';
import { Producto } from 'src/products/entities/product.entity';
import { OrderDetails } from 'src/orders/entities/orderDetails';

dotenvConfig({ path: '.env.development.local' });
const config = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'postgresdb',
  port: (process.env.DB_PORT) || 5432,
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'password',
  database: process.env.DB_NAME ?? 'mydb',
  // dropSchema: true,
  autoLoadEntities: true,
  synchronize: true,
  logging: true,
  entities: [User, Orders, OrderDetails, Categories, Producto],
  migrations: ['dis/migrations/*{.ts,.js'],
};

export default registerAs('typeorm', () => config);

const connectionSource = new DataSource(config as DataSourceOptions);
connectionSource.initialize()
