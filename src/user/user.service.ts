import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/users.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from '../dtos/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private mailerService: MailerService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const user1 = await this.userRepo.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (user1) {
      throw new BadRequestException('User Already Exists!');
    }
    const user = this.userRepo.create(createUserDto);
    this.mailerService.sendMail({
      to: user.email,
      from: 'pawan.bansari@creolestudios.com',
      subject: 'Registration successfull',
      text: 'Thanks for registring with us!',
    });
    return this.userRepo.save(user);
  }

  async finByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepo.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid credentials!');
    }
    return user;
  }
}
