import { ApiProperty } from '@nestjs/swagger';

export class CreateThirdPartyDto {
  @ApiProperty()
  third_party_name: string;
}