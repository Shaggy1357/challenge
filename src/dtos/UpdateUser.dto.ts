import { PartialType } from '@nestjs/mapped-types';
import { CreateUser } from './createUser.dto';

export class UpdateUser extends PartialType(CreateUser) {}
