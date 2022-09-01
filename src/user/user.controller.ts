import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { ParseArrayPipe } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { addAddressDto } from '../dtos/AddAddress.dto';
import { ChangePassword } from '../dtos/changePassword.dto';
import { CreateUserDto } from '../dtos/createUser.dto';
import { UpdateAddressDto } from '../dtos/updateAddress.dto';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';
import { UserEntity } from '../entities/users.entity';
import { UserService } from './user.service';

export const Storage = {
  storage: diskStorage({
    destination: './upload/profileImages',
    filename: (req, file, cb) => {
      const filename: string = file.originalname;
      const fileName: string = filename.replace(/\s/g, '');
      // console.log(fileName);
      const extention: string[] = fileName.split('.');
      // console.log(extention);
      //const Extention: string = extention[1];
      cb(null, `${extention[0]}${new Date().getTime()}.${extention[1]}`);
    },
  }),
};
@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @UseInterceptors(FileInterceptor('file', Storage))
  @Post('/register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    // console.log(file);
    console.log(file);
    return await this.usersService.register(createUserDto, file.filename);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':email')
  async findbyemail(@Param('email') email: string): Promise<UserEntity> {
    // console.log(req.user.userEmail);
    return await this.usersService.finByEmail(email);
  }

  @UseInterceptors(FileInterceptor('file', Storage))
  @UseGuards(AuthGuard('jwt'))
  @Patch('/updateuser')
  async updateUser(
    @Body() updateUser: UpdateUserDto,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(req.user.userEmail);
    const userId = req.user.userId;
    console.log(userId);
    console.log(file, 'qwer');
    return await this.usersService.updates(updateUser, userId, file);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/changepassword')
  async changePassworduser(@Body() changePassword: ChangePassword, @Req() req) {
    const userId = req.user.userId;
    return await this.usersService.changePasswordUser(changePassword, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/AddMultipleAddress')
  async AddMultipleAddress(
    @Body(new ParseArrayPipe({ items: addAddressDto, whitelist: true }))
    body: addAddressDto[],
    @Req() req,
  ) {
    console.log('id', req.user.userId);
    return await this.usersService.ADD(body, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/updateAddress')
  async updateAddress(@Body() body: UpdateAddressDto, @Req() req) {
    return this.usersService.UPDATE(body, body.id, req.user.userId);
  }
}
