import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { ThirdPartyService } from './third-party.service';
import { CreateThirdPartyDto } from './dto/create-third-party.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import AccessProfile from 'src/auth/enums/permission.type';

@ApiTags('Third-party')
@Controller('third-party')
@ApiBearerAuth()
export class ThirdPartyController {
  constructor(private readonly thirdPartyService: ThirdPartyService) {}

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  async create(@Body() createThirdPartyDto: CreateThirdPartyDto) {
    return this.thirdPartyService.create(createThirdPartyDto);
  }

  @Get('user/:userId')
  @UseGuards(PermissionGuard(AccessProfile.CLIENT))
  @ApiParam({ name: 'userId', required: true, description: 'ID do usuário' })
  async findThirdPartiesByUserId(@Param('userId') userId: string) {
    return this.thirdPartyService.findThirdPartiesByUserId(userId);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async findAll() {
    return this.thirdPartyService.findAll();
  }
}
