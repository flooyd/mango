/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('match_summary')
export class MatchSummary {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  match_id!: string;

  @Column('varchar')
  radiantHero0!: string;

  @Column('varchar')
  radiantHero1!: string;

  @Column('varchar')
  radiantHero2!: string;

  @Column('varchar')
  radiantHero3!: string;

  @Column('varchar')
  radiantHero4!: string;

  @Column('varchar')
  direHero0!: string;

  @Column('varchar')
  direHero1!: string;

  @Column('varchar')
  direHero2!: string;

  @Column('varchar')
  direHero3!: string;

  @Column('varchar')
  direHero4!: string;

  @Column('varchar', { nullable: true, default: '' })
  radiantPlayer0?: string;

  @Column('varchar', { nullable: true, default: '' })
  radiantPlayer1?: string;

  @Column('varchar', { nullable: true, default: '' })
  radiantPlayer2?: string;

  @Column('varchar', { nullable: true, default: '' })
  radiantPlayer3?: string;

  @Column('varchar', { nullable: true, default: '' })
  radiantPlayer4?: string;

  @Column('varchar', { nullable: true, default: '' })
  direPlayer0?: string;

  @Column('varchar', { nullable: true, default: '' })
  direPlayer1?: string;

  @Column('varchar', { nullable: true, default: '' })
  direPlayer2?: string;

  @Column('varchar', { nullable: true, default: '' })
  direPlayer3?: string;

  @Column('varchar', { nullable: true, default: '' })
  direPlayer4?: string;

  @Column('int', { nullable: true, default: 0 })
  gameWinner?: number;

  @Column('varchar', { nullable: true, default: '' })
  radiantKills?: string;

  @Column('varchar', { nullable: true, default: '' })
  direKills?: string;

  @Column('varchar', { nullable: true, default: '' })
  endTime?: string;

  @Column('float', { nullable: true, default: 0 })
  duration?: number;
}