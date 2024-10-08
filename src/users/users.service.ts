import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcrypt';
import { NameValidate } from 'src/common/utils/name.validate';
import { UserResponseLoginDto } from './dto/user.response.login.dto';
import { plainToClass } from 'class-transformer';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAll(PaginationFilter: FilterWorkstation, search: QueryUserDto) {
    const { search_name, search_userId } = search;
    const query = this.userRepository.createQueryBuilder('user');

    if (search_name || search_userId) {
      query.andWhere(
        new Brackets((queryBuilderOne) => {
          if (search_name) {
            queryBuilderOne.where('user.user_name LIKE :user_name', {
              user_name: `%${search_name}%`,
            });
          }
          if (search_userId) {
            queryBuilderOne.orWhere('user.user_id LIKE :user_id', {
              user_id: `%${search_userId}%`,
            });
          }
        }),
      );
    }

    return paginate<UserEntity>(query, PaginationFilter);
  }

  async getCurrentUser(id: string): Promise<UserResponseLoginDto> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.user_id = :user_id', { user_id: id })
      .getOne();

    const userDto: UserResponseLoginDto = plainToClass(
      UserResponseLoginDto,
      user,
      {
        excludeExtraneousValues: true,
      },
    );

    return userDto;
  }

  async findById(id: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.user_id = :user_id', { user_id: id })
      .getOne();
  }

  async findByEmail(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.user_email = :user_email', { user_email: email })
      .getOne();
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { user_email } = createUserDto;

    await this.checkExistingUser(
      this.userRepository.createQueryBuilder('user'),
      'user_email',
      user_email,
    );

    NameValidate.getInstance().getValidName(createUserDto.user_name);
    NameValidate.getInstance().getValidEmail(createUserDto.user_email);

    const user = this.userRepository.create(createUserDto);
    user.user_password = await this.hashPassword(user.user_password);
    user.user_profile;

    return await this.userRepository.save(user);
  }

  async registerPublic(createClientDto: CreateClientDto): Promise<UserEntity> {
    const { user_email } = createClientDto;
    await this.checkExistingUser(
      this.userRepository.createQueryBuilder('user'),
      'user_email',
      user_email,
    );

    NameValidate.getInstance().getValidName(createClientDto.user_name);
    NameValidate.getInstance().getValidEmail(createClientDto.user_email);

    const user = this.userRepository.create(createClientDto);
    user.user_password = await this.hashPassword(user.user_password);
    user.user_profile = 2;

    return await this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    const { user_email } = updateUserDto;

    await this.checkExistingUser(
      this.userRepository
        .createQueryBuilder('user')
        .where('user.user_id != :id', { id }),
      'user_email',
      user_email,
    );

    await this.validateAndUpdateUserFields(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }

  async updateRefreshToken(id: string, refresh_token: string) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: id,
      },
    });

    if (!user) {
      throw new NotFoundException(`user with id ${id} does not exist`);
    }

    user.user_refresh_token = refresh_token;

    await this.userRepository.save(user);
  }

  private async checkExistingUser(
    queryBuilder: any,
    field: string,
    value: string,
  ) {
    const user = await queryBuilder
      .where(`user.${field} = :value`, { value })
      .getOne();

    if (user) {
      throw new BadRequestException(
        `Este ${field === 'user_email' ? 'email' : 'número'} já está cadastrado!`,
      );
    }
  }

  private async validateAndUpdateUserFields(
    user: UserEntity,
    updateUserDto: UpdateUserDto,
  ) {
    user.user_name = NameValidate.getInstance().getValidName(
      updateUserDto.user_name || user.user_name,
    );
    user.user_email = NameValidate.getInstance().getValidEmail(
      updateUserDto.user_email || user.user_email,
    );
    user.user_profile = updateUserDto.user_profile || user.user_profile;
  }
}
