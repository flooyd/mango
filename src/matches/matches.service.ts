import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchDetails } from 'src/Entities/matchdetails.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchDetails)
    private matchDetailsRepo: Repository<MatchDetails>,
  ) {}

  async getMatchSummary(matchId: string) {
    const match = await this.matchDetailsRepo.findOne({ match_id: matchId });
    if (match) delete match.match_content;
    return match;
  }
}
