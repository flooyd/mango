import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplaysController } from './replays/replays.controller';
import { ReplaysService } from './replays/replays.service';
import { MatchesController } from './matches/matches.controller';
import { MatchesService } from './matches/matches.service';
import { MatchDetails } from './Entities/matchdetails.entity';

@Module({
  imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([MatchDetails])],
  controllers: [AppController, ReplaysController, MatchesController],
  providers: [AppService, ReplaysService, MatchesService],
})
export class AppModule {}
