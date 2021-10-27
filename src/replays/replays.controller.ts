import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReplaysService } from './replays.service';

@Controller('replays')
export class ReplaysController {
  constructor(private replaysService: ReplaysService) {}
  @Get()
  getReplays() {
    return this.replaysService.getReplays();
  }

  @Post('/:matchId')
  saveParsedReplay(@Param('matchId') matchId: string) {
    return this.replaysService.saveParsedReplay(matchId);
  }
}
