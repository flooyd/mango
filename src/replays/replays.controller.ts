import { Controller, Get } from '@nestjs/common';
import { ReplaysService } from './replays.service';

@Controller('replays')
export class ReplaysController {
  constructor(private replaysService: ReplaysService) {}
  @Get()
  getReplays() {
    return this.replaysService.getReplays();
  }
}
