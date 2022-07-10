import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GameEntity } from './GameEntity';

@Entity('words')
export class WordEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    word: string;

  @Column()
    available: boolean;  

  @Column()
    current: boolean;

  @OneToMany(() => GameEntity, (game: GameEntity) => game.user)
    games: Array<GameEntity>;
}
