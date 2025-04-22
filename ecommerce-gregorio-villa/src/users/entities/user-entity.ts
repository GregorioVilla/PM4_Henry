import { Orders } from 'src/orders/entities/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;
  @Column({ type: 'varchar', length: 50, nullable: false })
  @Column({ nullable: true })
  birthdate: Date;

  name: string;
  @Column({ type: 'varchar', length: 80, nullable: false })
  password: string;
  @Column({ type: 'varchar', length: 50, nullable: false })
  address: string;
  @Column({ type: 'bigint' })
  phone: number;
  @Column({ type: 'varchar', length: 50, nullable: false })
  country: string;
  @Column({ type: 'varchar', length: 50, nullable: false })
  city: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isAdmin: boolean;
  @OneToMany(() => Orders, (order) => order.user)
  orders: Orders[];
}
