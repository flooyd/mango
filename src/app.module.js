var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forRoot(),
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
], AppModule);
export { AppModule };
