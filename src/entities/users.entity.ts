import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AddressBook } from './addressBook.entity';
import { Exclude } from 'class-transformer';
import { IsDate } from 'class-validator';
export const PROFILE_USER = 'profile_user_details';
@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: null })
  profilephoto: string;

  // @Column()
  // @IsDate()
  // createdAt: Date;

  @OneToMany(() => AddressBook, (address) => address.user /*{ cascade: true }*/)
  addresses: AddressBook[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatepassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  constructor(partial: Partial<Users>) {
    Object.assign(this, partial);
  }
}
