import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseEntity } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { CreditCardEntity } from 'src/credit-card/entities/credit-card.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { ThirdPartyEntity } from 'src/third-party/entities/third-party.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly expenseRepository: Repository<ExpenseEntity>,

    @InjectRepository(CreditCardEntity)
    private readonly creditCardRepository: Repository<CreditCardEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(ThirdPartyEntity)
    private readonly thirdPartyRepository: Repository<ThirdPartyEntity>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<ExpenseEntity> {
    const {
      category_id,
      credit_card_id,
      third_party_id,
      amount,
      ...expenseData
    } = createExpenseDto;

    const category = await this.categoryRepository.findOne({
      where: { category_id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const creditCard = await this.creditCardRepository.findOne({
      where: { card_id: credit_card_id },
    });
    if (!creditCard) {
      throw new NotFoundException('Credit Card not found');
    }

    const thirdParty = third_party_id
      ? await this.thirdPartyRepository.findOne({ where: { third_party_id } })
      : null;

    if (third_party_id && !thirdParty) {
      throw new NotFoundException('Third Party not found');
    }

    if (creditCard.available_limit < amount) {
      throw new BadRequestException('Limite insuficiente no cartão de crédito');
    }

    creditCard.available_limit -= amount;
    await this.creditCardRepository.save(creditCard);

    const expense = this.expenseRepository.create({
      ...expenseData,
      amount,
      category,
      credit_card: creditCard,
      third_party: thirdParty,
    });

    return this.expenseRepository.save(expense);
  }

  async findAll(): Promise<ExpenseEntity[]> {
    return this.expenseRepository.find({
      relations: ['credit_card', 'category', 'third_party'],
    });
  }

  async findOne(expense_id: string): Promise<ExpenseEntity> {
    const expense = await this.expenseRepository.findOne({
      where: { expense_id },
      relations: ['credit_card', 'category', 'third_party'],
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${expense_id} not found`);
    }

    return expense;
  }

  async findExpensesByFilters(
    userId: string,
    thirdPartyId?: string,
    startDate?: Date,
    endDate?: Date,
    creditCardId?: string,
  ): Promise<{ expenses: ExpenseEntity[]; totalAmount: number }> {
    const query = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.credit_card', 'credit_card')
      .leftJoinAndSelect('expense.category', 'category')
      .leftJoinAndSelect('expense.third_party', 'third_party')
      .where('credit_card.user_id = :userId', { userId });

    if (creditCardId) {
      query.andWhere('expense.credit_card_id = :creditCardId', {
        creditCardId,
      });
    }

    if (thirdPartyId) {
      query.andWhere('expense.third_party_id = :thirdPartyId', {
        thirdPartyId,
      });
    } else {
      query.andWhere('expense.third_party_id IS NULL');
    }

    if (startDate && endDate) {
      query.andWhere('expense.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const expenses = await query.getMany();
    const totalAmount = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    return { expenses, totalAmount };
  }

  async findExpensesForCurrentMonth(
    userId: string,
    thirdPartyId?: string,
  ): Promise<{ expenses: ExpenseEntity[]; totalAmount: number }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return this.findExpensesByFilters(
      userId,
      thirdPartyId,
      startOfMonth,
      endOfMonth,
    );
  }

  async findExpensesForLastMonth(
    userId: string,
    thirdPartyId?: string,
  ): Promise<{ expenses: ExpenseEntity[]; totalAmount: number }> {
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return this.findExpensesByFilters(
      userId,
      thirdPartyId,
      startOfLastMonth,
      endOfLastMonth,
    );
  }

  async findExpensesByMonth(
    userId: string,
    month: number,
    year: number,
    thirdPartyId?: string,
  ): Promise<{ expenses: ExpenseEntity[]; totalAmount: number }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return this.findExpensesByFilters(userId, thirdPartyId, startDate, endDate);
  }

  async update(
    expense_id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<ExpenseEntity> {
    const {
      category_id,
      credit_card_id,
      third_party_id,
      amount,
      ...expenseData
    } = updateExpenseDto;

    const expense = await this.findOne(expense_id);

    if (category_id) {
      const category = await this.categoryRepository.findOne({
        where: { category_id },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      expense.category = category;
    }

    if (credit_card_id) {
      const creditCard = await this.creditCardRepository.findOne({
        where: { card_id: credit_card_id },
      });
      if (!creditCard) {
        throw new NotFoundException('Credit Card not found');
      }
      expense.credit_card = creditCard;
    }

    if (third_party_id) {
      const thirdParty = await this.thirdPartyRepository.findOne({
        where: { third_party_id },
      });
      if (!thirdParty) {
        throw new NotFoundException('Third Party not found');
      }
      expense.third_party = thirdParty;
    }

    Object.assign(expense, expenseData);

    return this.expenseRepository.save(expense);
  }

  async remove(expense_id: string): Promise<void> {
    const expense = await this.findOne(expense_id);

    if (expense.credit_card) {
      expense.credit_card.available_limit += expense.amount;
      await this.creditCardRepository.save(expense.credit_card);
    }

    await this.expenseRepository.remove(expense);
  }
}
