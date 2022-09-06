import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AddressBook } from './addressBook.entity';
import { Exclude } from 'class-transformer';
import { BlackList } from './blacklist.entity';

@Entity()
export class UserEntity {
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

  @Column()
  profilephoto: string;

  @OneToMany(() => AddressBook, (address) => address.user /*{ cascade: true }*/)
  addresses: AddressBook[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatepassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
