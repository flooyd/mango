/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('match_details')
export class MatchDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  match_id: string;

  @Column()
  match_content: string;
}
