import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/users.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from '../dtos/createUser.dto';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private mailerService: MailerService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
    file: string,
  ): Promise<CreateUserDto> {
    console.log('by', createUserDto.email);
    const user1 = await this.userRepo.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (user1) {
      throw new BadRequestException('User Already Exists!');
    }
    // console.log('1');

    const user = this.userRepo.create(createUserDto);
    user.profilephoto = file;
    // console.log('pf', hi);
    // console.log(user.profilephoto);
    // console.log(createUserDto.email);
    console.log(user.email);
    this.mailerService
      .sendMail({
        to: user.email,
        from: 'pawan.bansari@creolestudios.com',
        subject: 'Registration successfull',
        text: 'Thanks for registring with us!',
      })
      .catch((mailError) => {
        console.log('Mailer Error', mailError);
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
      throw new BadRequestException('Email does not exist!');
    }

    // console.log(user.profilephoto);

    user.profilephoto = `${process.env.file_path}${user.profilephoto}`;

    return user;
  }

  async update(
    updateUser: UpdateUserDto,
    id: number,
    file,
  ): Promise<CreateUserDto> {
    console.log(id);
    const user = await this.userRepo.findOneBy({ id });
    console.log('FIle Delte', `${file.destination}/${user.profilephoto}`);
    fs.unlink(`${file.destination}/${user.profilephoto}`, (err) => {
      if (err) {
        console.log(err);
        return err;
      }
    });
    console.log(user);
    user.name = updateUser.name;
    user.gender = updateUser.gender;
    user.profilephoto = file.filename;
    console.log(user);
    console.log(file);

    return this.userRepo.save(user);
  }
}
