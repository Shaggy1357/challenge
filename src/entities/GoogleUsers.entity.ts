import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GoogleUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  displayName: string;
}
