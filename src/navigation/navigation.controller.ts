import { Controller, Get, Param } from '@nestjs/common';
import { NavigationService } from './navigation.service';

@Controller('navigation')
export class NavigationController {
  constructor(private navigationService: NavigationService) {}

  @Get('get-window')
  getDota2Window() {
    return this.navigationService.getDota2Window();
  }

  @Get('bring-to-top')
  bringToTop() {
    return this.navigationService.bringToTop();
  }

  @Get('open-replay/:match_id')
  openReplay(@Param('match_id') matchId: string) {
    this.navigationService.openReplay(matchId);
  }

  @Get('goto-tick/:tick')
  gotoTick(@Param('tick') tick: number) {
    this.navigationService.gotoTick(tick);
  }
}
