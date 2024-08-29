import { ExpenseEntity } from 'src/expense/entities/expense.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';

@Entity('CreditCard')
export class CreditCardEntity {
  @PrimaryGeneratedColumn('uuid')
  card_id: string;

  @Column()
  bank_name: string;

  @Column()
  last_four_digits: string;

  @Column()
  card_holder_name: string;

  @Column()
  credit_limit: number;

  @ManyToOne(() => UserEntity, (user) => user.creditCards)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ExpenseEntity, (expense) => expense.credit_card)
  expenses: ExpenseEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}