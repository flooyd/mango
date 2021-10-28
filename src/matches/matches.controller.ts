import { Controller, Get, Param } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}
  @Get('details/:matchId')
  getMatchDetails(@Param('matchId') matchId: string) {
    console.log(matchId);
    return this.matchesService.getMatchDetails(matchId);
  }

  @Get('summary/:matchId')
  getMatchSummary(@Param('matchId') matchId: string) {
    return this.matchesService.getMatchSummary(matchId);
  }
}
