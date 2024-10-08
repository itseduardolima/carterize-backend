import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class CreateClientDto extends OmitType(UserEntity, [
  'user_id',
  'userCreatedDate',
  'userUpdateDate',
  'user_profile',
]) {
  @ApiProperty()
  user_name: string;

  @ApiProperty()
  user_email: string;

  @ApiProperty()
  user_password: string;
}
