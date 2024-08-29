import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';

@ApiTags('Expenses')
@Controller('expenses')
@ApiBearerAuth()
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(createExpenseDto);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  findAll() {
    return this.expenseService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  remove(@Param('id') id: string) {
    return this.expenseService.remove(id);
  }
}
