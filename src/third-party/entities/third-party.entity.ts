import { ExpenseEntity } from 'src/expense/entities/expense.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity('ThirdParty')
export class ThirdPartyEntity {
  @PrimaryGeneratedColumn('uuid')
  third_party_id: string;

  @Column()
  third_party_name: string;

  @ManyToOne(() => UserEntity, (user) => user.thirdParties)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ExpenseEntity, (expense) => expense.third_party)
  expenses: ExpenseEntity[];
}
