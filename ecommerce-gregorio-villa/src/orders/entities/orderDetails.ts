import { Producto } from "src/products/entities/product.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, JoinColumn } from "typeorm";
import { Orders } from "./order.entity";

@Entity({ name: 'order_details' })
export class OrderDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToMany(() => Producto, (producto) => producto.orderDetails)
  @JoinTable({
    name: 'order_details_products', // Nombre personalizado de la tabla intermedia
    joinColumn: {
      name: 'order_detail_id', // Nombre de la columna en la tabla intermedia que referencia a OrderDetails
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id', // Nombre de la columna en la tabla intermedia que referencia a Producto
      referencedColumnName: 'id',
    },
  })
  products: Producto[];

  @ManyToOne(() => Orders, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: Orders;
}
