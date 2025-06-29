import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchDetails } from '../Entities/matchdetails.entity';
import { MatchSummary } from '../Entities/matchsummary.entity';
import { ReplaysService } from '../replays/replays.service';
import { Repository } from 'typeorm';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchDetails)
    private matchDetailsRepo: Repository<MatchDetails>,
    @InjectRepository(MatchSummary)
    private matchSummaryRepo: Repository<MatchSummary>,
    private replayService: ReplaysService,
  ) {}

  async getMatchDetails(matchId: string) {
    const matchDetails = await this.matchDetailsRepo.findOne({
      where: { match_id: matchId },
    });

    if (!matchDetails) {
      throw new Error(`Match with ID ${matchId} not found`);
    }

    const matchContent = matchDetails.match_content.toString();
    const matchContentArray = matchContent.split('\n');
    const parsedData = await this.replayService.myParse(matchContentArray);

    const processedMatchDetails: any = {};

    processedMatchDetails.Last10Intervals = this.getLast10Intervals(
      parsedData['interval'],
    );
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
    processedMatchDetails.EndGameItems = this.trimAndProcessItems(
      parsedData['CONSTANT_ITEM']);
    processedMatchDetails.Kills = parsedData['DOTA_COMBATLOG_DEATH'];
    processedMatchDetails.pvpKills = this.getpvpKills(
      parsedData['DOTA_COMBATLOG_DEATH'],
    );
    processedMatchDetails.Chat = parsedData['chat'];
    console.log('processedMatchDetails.Chat');
    return processedMatchDetails;
  }

  async getMatchSummary(matchId: string) {
    const matchSummary = await this.matchSummaryRepo.findOne({
      where: { match_id: matchId },
    });

    return matchSummary;
  }

  getLast10Intervals(intervals: any[]) {
    const last10Intervals = intervals.slice(-10);
    return last10Intervals;
  }

  getpvpKills(kills: any[]) {
    kills = kills.filter((kill) => kill.ispvpkill);
    for (const kill of kills) {
      kill.attackername = kill.attackername.replace('npc_dota_hero_', '');
      kill.targetname = kill.targetname.replace('npc_dota_hero_', '');
    }
    return kills;
  }

  trimAndProcessItems(items: any[]) {
    console.log('trimAndProcessItems called');
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
        case 'trollwarlord':
          item.targetname = 'troll_warlord';
        case 'facelessvoid':
          console.log('facelessvoid');
          item.targetname = 'faceless_void';
          continue;
        case 'phantomlancer':
          item.targetname = 'phantom_lancer';
          continue;
        case 'stormspirit':
          item.targetname = 'storm_spirit';
          continue;
        case 'emberspirit':
          item.targetname = 'ember_spirit';
          continue;
        case 'earthspirit':
          item.targetname = 'earth_spirit';
          continue;
        case 'drowranger':
          item.targetname = 'drow_ranger';
          continue;
        case 'keeperofthelight':
          item.targetname = 'keeper_of_the_light'
          continue;
        default:
          continue;
      }
    }
    return trimmedItems;
  }
}
