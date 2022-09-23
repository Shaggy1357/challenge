import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MicrosoftUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  //   @Column()
  //   picture: any;
}
