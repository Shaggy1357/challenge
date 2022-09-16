import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUser } from '../dtos/createUser.dto';
import { UpdateUser } from '../dtos/UpdateUser.dto';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { ChangePassword } from 'src/dtos/changePassword.dto';
import { AddressBook } from '../entities/addressBook.entity';
import { UpdateAddress } from '../dtos/updateAddress.dto';
import { BlackList } from '../entities/blacklist.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
// var moment = require('moment');
import 'moment-timezone';
import * as moment from 'moment';
import { responseMap, success } from '../generics/genericResponse';

// import { RedisService } from '../redis/redis.service';
@Injectable()
export class UserService {
  //Getting instances of redis, mailer and repositories.
  constructor(
    // private redisService: RedisService,
    @InjectRepository(Users) private userRepo: Repository<Users>,
    @InjectRepository(AddressBook) private addressRepo: Repository<AddressBook>,
    @InjectRepository(BlackList) private blackListRepo: Repository<BlackList>,
    private mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_QUARTER)
  deleteBlackList() {
    this.blackListRepo.query(`DELETE FROM black_list`);
  }

  //Registration
  async register(
    createUserDto: CreateUser,
    file: Express.Multer.File,
  ): Promise<success> {
    // try {
    //Checking if a user already exists.
    // console.log('second');
    const existingUser = await this.userRepo.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    // console.log('third', existingUser);

    if (existingUser) {
      // console.log('fourth');
      throw new BadRequestException('User Already Exists!');
    }
    //Creating a new user.
    // console.log('fifth');

    const newUser = this.userRepo.create(createUserDto);
    // console.log('fifth', newUser);

    if (file) {
      // console.log('sixth');
      newUser.profilephoto = file.filename;
    }

    // const m = moment().toDate();
    // console.log('first', m);
    // console.log('second', typeof m);

    // newUser.created_at_date = m.toDateString();
    // Sending a mail to user after successfull registration.
    this.mailerService
      .sendMail({
        to: newUser.email,
        from: 'pawan.bansari@creolestudios.com',
        subject: 'Registration successfull',
        text: 'Thanks for registring with us!',
      })
      .catch((mailError) => {
        console.log('Mailer Error', mailError);
      });
    // //Saving the user in DB.
    await this.userRepo.save(newUser);
    // console.log('second');
    return responseMap(newUser, 'success!');
    // } catch (error) {
    //   console.log(error);
    // }
  }

  //Helper function to find user by enterred email.
  async findByEmail(email: string): Promise<Users> {
    const existingUser = await this.userRepo.findOne({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      throw new BadRequestException('User does not exist!');
    }
    //Setting file path for local storage.
    existingUser.profilephoto = `${process.env.file_path}${existingUser.profilephoto}`;
    return existingUser;
  }

  //Helper function to find user by date.
  async findbydate(doc: Date): Promise<Users[]> {
    console.log('second', doc);

    console.log('third', typeof doc);

    const doa = moment(doc).tz('Asia/Kolkata');
    console.log('fourth', doa);

    const dod = doa.format('YYYY-MM-DD');
    console.log('fifth', typeof dod);
    // const myDate = moment(doa, 'YYYY-MM-DD').toDate();
    // console.log('fifth', typeof myDate);

    const existingUser = await this.userRepo.find({});
    console.log('sixth', typeof existingUser[0].created_at);

    // if (!existingUser) {
    //   throw new BadRequestException('User does ot exist!');
    // }
    return;
  }

  //Update user function.
  async updates(updateUser: UpdateUser, id: number, file) {
    //Getting user details before updating.
    const existingUser = await this.userRepo.findOneBy({ id });
    //Deleting the previous file vefore saving new file.
    if (file) {
      fs.unlink(`${file.destination}/${existingUser.profilephoto}`, (err) => {
        if (err) {
          console.log(err);
          return err;
        }
      });
    }
    existingUser.name = updateUser?.name ? updateUser.name : existingUser.name;
    existingUser.gender = updateUser?.gender
      ? updateUser.gender
      : existingUser.gender;
    if (file) {
      existingUser.profilephoto = file.filename;
    }
    return this.userRepo.save(existingUser);
  }

  //Change password function.
  async changePasswordUser(
    changePassword: ChangePassword,
    id: number,
  ): Promise<Users> {
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
  async UPDATE(address: UpdateAddress, addressId: number, userid: number) {
    //Finding particular address updated by the user
    const arrs = await this.addressRepo.query(
      ` select * from address_book where id = ${addressId} AND userID = ${userid}`,
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
  async logout(user, jwt) {
    //Getting existing signed token from request.
    // const tok = req.rawHeaders[1].split(' ');
    // const tok2 = tok[1];
    const userId = user.userId;
    //Saving token in DB.
    await this.blackListRepo.save({
      token: jwt,
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
