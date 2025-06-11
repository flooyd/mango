import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplaysController } from './replays/replays.controller';
import { ReplaysService } from './replays/replays.service';
import { MatchesController } from './matches/matches.controller';
import { MatchesService } from './matches/matches.service';
import { MatchDetails } from './Entities/matchdetails.entity';
import { MatchSummary } from './Entities/matchsummary.entity';
import { NavigationController } from './navigation/navigation.controller';
import { NavigationService } from './navigation/navigation.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'dota2_replays',
      entities: [MatchDetails, MatchSummary],
      synchronize: true, // Set to false in production
      logging: true,
    }),
    TypeOrmModule.forFeature([MatchDetails]),
    TypeOrmModule.forFeature([MatchSummary]),
  ],
  controllers: [
    AppController,
    ReplaysController,
    MatchesController,
    NavigationController,
  ],
  providers: [AppService, ReplaysService, MatchesService, NavigationService],
})
export class AppModule { }
