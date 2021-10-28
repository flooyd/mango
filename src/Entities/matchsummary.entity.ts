/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('match_summary')
export class MatchSummary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  match_id: string;

  @Column()
  radiantHero0: string;

  @Column()
  radiantHero1: string;

  @Column()
  radiantHero2: string;

  @Column()
  radiantHero3: string;

  @Column()
  radiantHero4: string;

  @Column()
  direHero0: string;

  @Column()
  direHero1: string;

  @Column()
  direHero2: string;

  @Column()
  direHero3: string;

  @Column()
  direHero4: string;

  @Column({nullable: true})
  gameWinner?: number = 0;

  @Column({nullable: true})
  radiantKills?: string = '';

  @Column({nullable: true})
  direKills?: string = '';

  @Column({nullable: true})
  endTime?: string = '';
}
