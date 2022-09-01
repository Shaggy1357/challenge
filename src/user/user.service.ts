import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Repository } from 'typeorm';
import { UserEntity } from '../entities/users.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from '../dtos/createUser.dto';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';
import * as fs from 'fs';
//import { ChangePassword } from '../dtos/changePassword.dto';
import * as bcrypt from 'bcrypt';
import { ChangePassword } from 'src/dtos/changePassword.dto';
import { AddressBook } from '../entities/addressBook.entity';
import { UpdateAddressDto } from '../dtos/updateAddress.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(AddressBook) private addressRepo: Repository<AddressBook>,
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

  async updates(
    updateUser: UpdateUserDto,
    id: number,
    file,
  ): Promise<CreateUserDto> {
    console.log(id);
    const user = await this.userRepo.findOneBy({ id });
    // console.log('FIle Delte', `${file.destination}/${user.profilephoto}`);
    if (file) {
      fs.unlink(`${file.destination}/${user.profilephoto}`, (err) => {
        if (err) {
          console.log(err);
          return err;
        }
      });
    }
    console.log(user);
    user.name = updateUser.name;
    user.gender = updateUser.gender;
    if (file) {
      user.profilephoto = file.filename;
    }
    console.log(user);
    console.log(file, 'asdf');

    return this.userRepo.save(user);
  }

  async changePasswordUser(
    changePassword: ChangePassword,
    id: number,
  ): Promise<UserEntity> {
    const user = await this.userRepo.findOneBy({ id });
    const currentPassword = changePassword.currentPassword;
    const newPassword = await bcrypt.hash(changePassword.newPassword, 10);
    const compare = await bcrypt.compare(currentPassword, user.password);
    // console.log(compare);

    if (!compare) {
      // console.log(user.password);
      throw new BadRequestException("Passwords don't match!");
    }
    user.password = newPassword;
    console.log(user);
    return this.userRepo.save(user);
  }

  async ADD(arr, id: number) {
    // console.log(arr);
    const user = await this.userRepo.findOneBy({ id });
    // console.log(user);
    // console.log(arr.length);
    arr.map(async (arr) => {
      // console.log(arr);
      const arrs: AddressBook = { ...arr, user };
      // console.log(arrs);
      await this.addressRepo.save(arrs);
    });
    return arr;
  }

  async UPDATE(address: UpdateAddressDto, addressId: number, id: number) {
    // const arrs  = await this.addressRepo.findOne({ where: {
    //   id: addressId,
    // }
    //  });
    const arrs = await this.addressRepo.query(
      ` select * from address_book where id = ${addressId} AND userID = ${id}`,
    );
    // const arrs = await this.addressRepo.findOneBy({arrid})
    // console.log(arrs[0]);
    // console.log(arr);
    // console.log(arrs);
    arrs[0].Title = address.Title;
    arrs[0].Address_Line_1 = address.Address_Line_1;
    arrs[0].Address_Line_2 = address.Address_Line_2;
    arrs[0].City = address.City;
    arrs[0].Country = address.Country;
    arrs[0].Pincode = address.Pincode;
    arrs[0].State = address.State;
    // console.log(arrs[0]);
    return await this.addressRepo.save(arrs[0]);
    // console.log(address.id);
  }
}
