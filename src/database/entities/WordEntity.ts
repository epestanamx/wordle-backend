import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GameEntity } from './GameEntity';

@Entity('words')
export class WordEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    word: string;

  @Column({ default: true })
    available: boolean;  

  @Column({ default: false })
    current: boolean;

  @OneToMany(() => GameEntity, (game: GameEntity) => game.user)
    games: Array<GameEntity>;
}
