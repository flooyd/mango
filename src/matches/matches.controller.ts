import { Controller, Get, Param } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}
  @Get('/:matchId')
  getMatchSummary(@Param('matchId') matchId: string) {
    console.log(matchId);
    return this.matchesService.getMatchSummary(matchId);
  }
}
