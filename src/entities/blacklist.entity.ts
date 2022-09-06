import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlackList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  userId: number;
}
