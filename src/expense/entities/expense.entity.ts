import { CreditCardEntity } from 'src/credit-card/entities/credit-card.entity';
import { ThirdPartyEntity } from 'src/third-party/entities/third-party.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('Expense')
export class ExpenseEntity {
  @PrimaryGeneratedColumn('uuid')
  expense_id: string;

  @Column()
  amount: number;

  @Column({ name: 'is_third_party' })
  is_third_party: boolean;

  @ManyToOne(() => CreditCardEntity, (creditCard) => creditCard.expenses)
  @JoinColumn({ name: 'credit_card_id' })
  credit_card: CreditCardEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.expenses)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @ManyToOne(() => ThirdPartyEntity, (thirdParty) => thirdParty.expenses, { nullable: true })
  @JoinColumn({ name: 'third_party_id' })
  third_party: ThirdPartyEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ default: false })
  status: boolean;
}
