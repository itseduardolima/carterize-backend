import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { CreditCardService } from './credit-card.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import AccessProfile from 'src/auth/enums/permission.type';

@ApiTags('Card')
@Controller('card')
@ApiBearerAuth()
export class CreditCardController {
  constructor(private readonly creditCardService: CreditCardService) {}

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  create(@Body() createCreditCardDto: CreateCreditCardDto) {
    return this.creditCardService.create(createCreditCardDto);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  findAll() {
    return this.creditCardService.findAll();
  }

  @Get('user/:userId')
  @ApiParam({ name: 'userId', type: 'string', description: 'ID do usuário' })
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  async getCardsByUserId( @Param('userId') userId: string ) {
    return this.creditCardService.findCardsByUserId(userId);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  findOne(@Param('id') id: string) {
    return this.creditCardService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  update(@Param('id') id: string, @Body() updateCreditCardDto: UpdateCreditCardDto) {
    return this.creditCardService.update(id, updateCreditCardDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  remove(@Param('id') id: string) {
    return this.creditCardService.remove(id);
  }
}