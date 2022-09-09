import {
  UseGuards,
  UseInterceptors,
  Get,
  UploadedFile,
  ParseArrayPipe,
  Param,
  Patch,
  Body,
  Controller,
  Post,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { addAddress } from '../dtos/AddAddress.dto';
import { ChangePassword } from '../dtos/changePassword.dto';
import { CreateUser } from '../dtos/createUser.dto';
import { UpdateAddress } from '../dtos/updateAddress.dto';
import { UpdateUser } from '../dtos/UpdateUser.dto';
import { Users } from '../entities/users.entity';
import { UserService } from './user.service';
import { Jwt } from '../decorators/jwt.decorator';

export const Storage = {
  storage: diskStorage({
    destination: './upload/profileImages',
    filename: (req, file, cb) => {
      const filename: string = file.originalname;
      const fileName: string = filename.replace(/\s/g, '');
      const extention: string[] = fileName.split('.');
      cb(null, `${extention[0]}${new Date().getTime()}.${extention[1]}`);
    },
  }),
};
@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  //Using interceptors for fetching files
  //Registration api
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('file', Storage))
  @Post('/register')
  async register(
    @Body() createUserDto: CreateUser,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<CreateUser> {
    return await this.usersService.register(createUserDto, file);
  }

  // Using custom auth guard for jwt validation and invalidation.
  // Helper function to find users with entered email.
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/find-by-email/:findUser')
  // @SerializeOptions({})
  async findbyemail(@Param('findUser') findUser: string): Promise<Users> {
    return await this.usersService.findByEmail(findUser);
  }

  //Update user api
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('file', Storage))
  @UseGuards(JwtAuthGuard)
  @Patch('/updateuser')
  async updateUser(
    @Body() updateUser: UpdateUser,
    @User() user,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = user.userId;
    return await this.usersService.updates(updateUser, userId, file);
  }

  //Change Password api
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('/changepassword')
  async changePassworduser(
    @Body() changePassword: ChangePassword,
    @User() user,
  ) {
    const userId = user.userId;
    return await this.usersService.changePasswordUser(changePassword, userId);
  }

  //Adding multiple addressess api
  @UseGuards(JwtAuthGuard)
  @Post('/AddMultipleAddress')
  async AddMultipleAddress(
    @Body(new ParseArrayPipe({ items: addAddress, whitelist: true }))
    body: addAddress[],
    @User() user,
  ) {
    return await this.usersService.ADD(body, user.userId);
  }

  //Updating a single address at once api
  @UseGuards(JwtAuthGuard)
  @Patch('/updateAddress')
  async updateAddress(@Body() body: UpdateAddress, @User() user) {
    return this.usersService.UPDATE(body, body.id, user.userId);
  }

  //logout api
  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout(@User() user, @Jwt() jwt) {
    return await this.usersService.logout(user, jwt);
  }
}
