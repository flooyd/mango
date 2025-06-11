var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchDetails } from '../Entities/matchdetails.entity';
import { MatchSummary } from '../Entities/matchsummary.entity';
import { ReplaysService } from '../replays/replays.service';
import { Repository } from 'typeorm';
let MatchesService = class MatchesService {
    constructor(matchDetailsRepo, matchSummaryRepo, replayService) {
        this.matchDetailsRepo = matchDetailsRepo;
        this.matchSummaryRepo = matchSummaryRepo;
        this.replayService = replayService;
    }
    async getMatchDetails(matchId) {
        const matchDetails = await this.matchDetailsRepo.findOne({
            where: { match_id: matchId },
        });
        if (!matchDetails) {
            throw new Error(`Match with ID ${matchId} not found`);
        }
        const matchContent = matchDetails.match_content.toString();
        const matchContentArray = matchContent.split('\n');
        const parsedData = await this.replayService.myParse(matchContentArray);
        const processedMatchDetails = {};
        processedMatchDetails.Last10Intervals = this.getLast10Intervals(parsedData['interval']);
        processedMatchDetails.heroKillChatMessages =
            parsedData['CHAT_MESSAGE_HERO_KILL'];
        processedMatchDetails.firstBlood = parsedData['DOTA_COMBATLOG_FIRST_BLOOD'];
        processedMatchDetails.types = parsedData.types;
        processedMatchDetails.Items = parsedData['DOTA_COMBATLOG_ITEM'];
        processedMatchDetails.GameState = parsedData['DOTA_COMBATLOG_GAME_STATE'];
        processedMatchDetails.matchInfo = parsedData.matchInfo;
        processedMatchDetails.Purchases = parsedData['DOTA_COMBATLOG_PURCHASE'];
        processedMatchDetails.Stats = parsedData['DOTA_COMBATLOG_PLAYERSTATS'];
        processedMatchDetails.Intervals = parsedData['interval'];
        processedMatchDetails.EndGameItems = this.trimAndProcessItems(parsedData['CONSTANT_ITEM'].slice(200));
        processedMatchDetails.Kills = parsedData['DOTA_COMBATLOG_DEATH'];
        processedMatchDetails.pvpKills = this.getpvpKills(parsedData['DOTA_COMBATLOG_DEATH']);
        processedMatchDetails.Chat = parsedData['chat'];
        return processedMatchDetails;
    }
    async getMatchSummary(matchId) {
        const matchSummary = await this.matchSummaryRepo.findOne({
            where: { match_id: matchId },
        });
        return matchSummary;
    }
    getLast10Intervals(intervals) {
        const last10Intervals = intervals.slice(-10);
        return last10Intervals;
    }
    getpvpKills(kills) {
        kills = kills.filter((kill) => kill.ispvpkill);
        for (const kill of kills) {
            kill.attackername = kill.attackername.replace('npc_dota_hero_', '');
            kill.targetname = kill.targetname.replace('npc_dota_hero_', '');
        }
        return kills;
    }
    trimAndProcessItems(items) {
        const endGameTime = items[items.length - 1].time;
        const trimmedItems = items.filter((item) => item.time === endGameTime);
        for (const item of trimmedItems) {
            item.targetname = item.targetname.replace('npc_dota_hero_', '');
            item.valuename = item.valuename.replace('item_', '');
            switch (item.targetname) {
                case 'shadowshaman':
                    item.targetname = 'shadow_shaman';
                    continue;
                case 'sandking':
                    item.targetname = 'sand_king';
                    continue;
                case 'doombringer':
                    item.targetname = 'doom_bringer';
                    continue;
                case 'darkwillow':
                    item.targetname = 'dark_willow';
                    continue;
                case 'spiritbreaker':
                    item.targetname = 'spirit_breaker';
                    continue;
                case 'spiritbreaker':
                    item.targetname = 'spirit_breaker';
                    continue;
                case 'skeletonking':
                    item.targetname = 'skeleton_king';
                    continue;
                case 'arcwarden':
                    item.targetname = 'arc_warden';
                    continue;
                case 'ancientapparition':
                    item.targetname = 'ancient_apparition';
                    continue;
                case 'phantomassassin':
                    item.targetname = 'phantom_assassin';
                    continue;
                case 'monkeyking':
                    item.targetname = 'monkey_king';
                    continue;
                default:
                    continue;
            }
        }
        return trimmedItems;
    }
};
MatchesService = __decorate([
    Injectable(),
    __param(0, InjectRepository(MatchDetails)),
    __param(1, InjectRepository(MatchSummary)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        ReplaysService])
], MatchesService);
export { MatchesService };
