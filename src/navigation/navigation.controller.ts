import { Controller, Get } from '@nestjs/common';
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
}
