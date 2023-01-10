import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column({ select: false })
  password: string;
}

export default User;
