import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchDetails } from 'src/Entities/matchdetails.entity';
import { MatchSummary } from 'src/Entities/matchsummary.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchDetails)
    private matchDetailsRepo: Repository<MatchDetails>,
    @InjectRepository(MatchSummary)
    private matchSummaryRepo: Repository<MatchSummary>,
  ) {}

  async getMatchDetails(matchId: string) {
    const matchDetails = await this.matchDetailsRepo.findOne({
      match_id: matchId,
    });
    return matchDetails;
  }

  async getMatchSummary(matchId: string) {
    const matchSummary = await this.matchSummaryRepo.findOne({
      match_id: matchId,
    });

    return matchSummary;
  }
}
