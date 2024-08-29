import { ExpenseEntity } from 'src/expense/entities/expense.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('Category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  category_name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ExpenseEntity, (expense) => expense.category)
  expenses: ExpenseEntity[];
}
