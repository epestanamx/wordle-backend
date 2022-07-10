import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './UserEntity';
import { WordEntity } from './WordEntity';

@Entity('games')
export class GameEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number;
  
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.games)
  @JoinColumn({ name: 'user_id' })
    user: UserEntity;

  @ManyToOne(() => WordEntity, (word: WordEntity) => word.games)
  @JoinColumn({ name: 'word_id' })
    word: WordEntity;

  @Column()
    won: boolean;
  
  @CreateDateColumn()
    createdAt: Date;
}
