import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import AccessProfile from 'src/auth/enums/permission.type';

@ApiTags('Expenses')
@Controller('expenses')
@ApiBearerAuth()
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense successfully created.' })
  @ApiResponse({ status: 404, description: 'Category, Credit Card, or Third Party not found.' })
  @ApiResponse({ status: 400, description: 'Insufficient credit limit on credit card.' })
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(createExpenseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiResponse({ status: 200, description: 'List of expenses.' })
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async findAll() {
    return this.expenseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an expense by ID' })
  @ApiResponse({ status: 200, description: 'The expense.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  async findOne(@Param('id') id: string) {
    const expense = await this.expenseService.findOne(id);
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense successfully updated.' })
  @ApiResponse({ status: 404, description: 'Expense, Category, Credit Card, or Third Party not found.' })
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  async remove(@Param('id') id: string) {
    await this.expenseService.remove(id);
    return { message: 'Expense successfully deleted' };
  }

  @Get('filter/current-month')
  @ApiOperation({ summary: 'Get expenses for the current month' })
  @ApiResponse({ status: 200, description: 'List of expenses for the current month.' })
  @ApiQuery({ name: 'userId', required: true, type: String })
  @ApiQuery({ name: 'thirdPartyId', required: false, type: String })
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  async findExpensesForCurrentMonth(
    @Query('userId') userId: string,
    @Query('thirdPartyId') thirdPartyId?: string,
  ) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { expenses, totalAmount } = await this.expenseService.findExpensesByFilters(
      userId, 
      thirdPartyId, 
      startOfMonth, 
      endOfMonth
    );

    return { expenses, totalAmount };
  }

  @Get('filter/by-month')
  @ApiOperation({ summary: 'Get expenses by specific month and year' })
  @ApiResponse({ status: 200, description: 'List of expenses for the specific month and year.' })
  @ApiQuery({ name: 'userId', required: true, type: String })
  @ApiQuery({ name: 'thirdPartyId', required: false, type: String })
  @ApiQuery({ name: 'month', required: true, type: Number, description: 'Month (1-12)' })
  @ApiQuery({ name: 'year', required: true, type: Number, description: 'Year (e.g., 2024)' })
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  async findExpensesByMonth(
    @Query('userId') userId: string,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('thirdPartyId') thirdPartyId?: string,
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const { expenses, totalAmount } = await this.expenseService.findExpensesByFilters(
      userId, 
      thirdPartyId, 
      startDate, 
      endDate
    );

    return { expenses, totalAmount };
  }

  @Get('filter')
  @ApiOperation({ summary: 'Get expenses by filters' })
  @ApiResponse({ status: 200, description: 'Filtered list of expenses.' })
  @ApiQuery({ name: 'userId', required: true, type: String })
  @ApiQuery({ name: 'thirdPartyId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  async findExpensesByFilters(
    @Query('userId') userId: string,
    @Query('thirdPartyId') thirdPartyId?: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.expenseService.findExpensesByFilters(userId, thirdPartyId, startDate, endDate);
  }
}
