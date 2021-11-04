import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchDetails } from 'src/Entities/matchdetails.entity';
import { MatchSummary } from 'src/Entities/matchsummary.entity';
import { ReplaysService } from 'src/replays/replays.service';
import { Repository } from 'typeorm';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchDetails)
    private matchDetailsRepo: Repository<MatchDetails>,
    @InjectRepository(MatchSummary)
    private matchSummaryRepo: Repository<MatchSummary>,
    private replayService: ReplaysService,
  ) {}

  async getMatchDetails(matchId: string) {
    const matchDetails = await this.matchDetailsRepo.findOne({
      match_id: matchId,
    });

    const matchContent = matchDetails.match_content.toString();
    const matchContentArray = matchContent.split('\n');
    const parsedData = await this.replayService.myParse(matchContentArray);

    const processedMatchDetails: any = {};

    processedMatchDetails.last10Intervals = this.getLast10Intervals(
      parsedData['interval'],
    );
    processedMatchDetails.heroKillChatMessages =
      parsedData['CHAT_MESSAGE_HERO_KILL'];
    processedMatchDetails.firstBlood = parsedData['DOTA_COMBATLOG_FIRST_BLOOD'];
    processedMatchDetails.types = parsedData.types;

    return processedMatchDetails;
  }

  async getMatchSummary(matchId: string) {
    const matchSummary = await this.matchSummaryRepo.findOne({
      match_id: matchId,
    });

    return matchSummary;
  }

  getLast10Intervals(intervals: any[]) {
    const last10Intervals = intervals.slice(-10);
    return last10Intervals;
  }
}
