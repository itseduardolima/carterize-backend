 import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  findAll() {
    return this.categoryService.findAll();
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  update(@Param('id') id: number, @Body() updateCategoryDto: CreateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  remove(@Param('id') id: number) {
    return this.categoryService.remove(id);
  }
}
