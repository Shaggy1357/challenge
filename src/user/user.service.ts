import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/users.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from '../dtos/createUser.dto';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { ChangePassword } from 'src/dtos/changePassword.dto';
import { AddressBook } from '../entities/addressBook.entity';
import { UpdateAddressDto } from '../dtos/updateAddress.dto';
import { BlackList } from '../entities/blacklist.entity';
// import { RedisService } from '../redis/redis.service';
@Injectable()
export class UserService {
  //Getting instances of redis, mailer and repositories.
  constructor(
    // private redisService: RedisService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(AddressBook) private addressRepo: Repository<AddressBook>,
    @InjectRepository(BlackList) private blackListRepo: Repository<BlackList>,
    private mailerService: MailerService,
  ) {}

  //Registration
  async register(
    createUserDto: CreateUserDto,
    file: string,
  ): Promise<CreateUserDto> {
    //Checking if a user already exists.

    const user1 = await this.userRepo.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (user1) {
      throw new BadRequestException('User Already Exists!');
    }
    //Creating a new user.
    const user = this.userRepo.create(createUserDto);
    user.profilephoto = file;
    //Sending a mail to user after successfull registration.
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
    //Saving the user in DB.
    await this.userRepo.save(user);
    return user;
  }

  //Helper function to find user by enterred email.
  async finByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepo.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new BadRequestException('Email does not exist!');
    }
    //Setting file path for local storage.
    user.profilephoto = `${process.env.file_path}${user.profilephoto}`;
    return user;
  }

  //Update user function.
  async updates(updateUser: UpdateUserDto, id: number, file) {
    //Getting user details before updating.
    const user = await this.userRepo.findOneBy({ id });
    //Deleting the previous file vefore saving new file.
    if (file) {
      fs.unlink(`${file.destination}/${user.profilephoto}`, (err) => {
        if (err) {
          console.log(err);
          return err;
        }
      });
    }
    user.name = updateUser.name;
    user.gender = updateUser.gender;
    if (file) {
      user.profilephoto = file.filename;
    }
    return this.userRepo.save(user);
  }

  //Change password function.
  async changePasswordUser(
    changePassword: ChangePassword,
    id: number,
  ): Promise<UserEntity> {
    //Getting user details before changing password.
    const user = await this.userRepo.findOneBy({ id });
    const currentPassword = changePassword.currentPassword;
    //Hashing the new entered password.
    const newPassword = await bcrypt.hash(changePassword.newPassword, 10);
    //Comparing the saved and entered password.
    const compare = await bcrypt.compare(currentPassword, user.password);
    if (!compare) {
      throw new BadRequestException("Passwords don't match!");
    }
    //saving the new password after comparison
    user.password = newPassword;
    //Saving the password.
    return this.userRepo.save(user);
  }

  //Address adding function.
  async ADD(arr, id: number) {
    //Getting user details(id) to link the address.
    const user = await this.userRepo.findOneBy({ id });
    //Saving address.
    arr.map(async (arr) => {
      const arrs: AddressBook = { ...arr, user };
      await this.addressRepo.save(arrs);
    });
    return arr;
  }

  //Update address function.
  async UPDATE(address: UpdateAddressDto, addressId: number, id: number) {
    //Finding particular address updated by the user
    const arrs = await this.addressRepo.query(
      ` select * from address_book where id = ${addressId} AND userID = ${id}`,
    );
    //Making changes.
    arrs[0].Title = address.Title;
    arrs[0].Address_Line_1 = address.Address_Line_1;
    arrs[0].Address_Line_2 = address.Address_Line_2;
    arrs[0].City = address.City;
    arrs[0].Country = address.Country;
    arrs[0].Pincode = address.Pincode;
    arrs[0].State = address.State;
    //Saving changes.
    return await this.addressRepo.save(arrs[0]);
  }

  //Logout function.
  async logout(req) {
    //Getting existing signed token from request.
    const tok = req.rawHeaders[1].split(' ');
    const tok2 = tok[1];
    const userId = req.user.userId;
    //Saving token in DB.
    await this.blackListRepo.save({
      token: tok2,
      userId,
    });
  }

  //Helper function for finding blacklisted tokens.
  async getToken(userId): Promise<BlackList> {
    return await this.blackListRepo.findOne({
      where: { userId },
      order: { id: 'DESC' },
    });
  }
}
