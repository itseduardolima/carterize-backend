import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
