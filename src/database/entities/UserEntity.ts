import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { GameEntity } from './GameEntity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    name: string;

  @Column()
    email: string;

  @Column()
    password: string;

  @Column({ default: 0 })
    attempts: number;
  
  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;

  @OneToMany(() => GameEntity, (game: GameEntity) => game.user)
    games: Array<GameEntity>;

}
