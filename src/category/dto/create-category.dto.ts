import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CategoryEntity } from '../entities/category.entity';

export class CreateCategoryDto extends OmitType(CategoryEntity, ['category_id', 'createdAt', 'updatedAt']) {
  @ApiProperty()
  category_name: string;
}
