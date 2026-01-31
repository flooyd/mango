import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchDetails } from '../Entities/matchdetails.entity';
import { Repository } from 'typeorm';
const bent = require('bent');
import { MatchSummary } from '../Entities/matchsummary.entity';

@Injectable()
export class ReplaysService {
  constructor(
    @InjectRepository(MatchDetails)
    private matchDetailsRepo: Repository<MatchDetails>,
    @InjectRepository(MatchSummary)
    private matchSummaryRepo: Repository<MatchSummary>,
  ) {}

  replayDirectory =
    'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/replays';
  replayDirectoryUbuntu =
    '/home/floyd/.local/share/Steam/steamapps/common/dota 2 beta/game/dota/replays';
  async getReplays() {
    let files = await fs.promises.readdir(this.replayDirectory);
    files = files.filter((file) => file != 'placeholder.txt');
    return files.map((file) => {
      return file.split('.')[0];
    });
  }

  async saveParsedReplay(matchId: string) {
    const file = fs.readFileSync(`${this.replayDirectory}/${matchId}.dem`);

    const post = bent('http://localhost:5600', 'POST', 'buffer', 200);
    try {
      const response = await post('/', file);
      const matchContent = response.toString();
      const matchContentArray = matchContent.split('\n');
      console.log(matchContentArray);
      const parsedData = await this.myParse(matchContentArray);
      const dataToSaveForSummary: any = {
        match_id: matchId,
      };

      for (const player of parsedData.matchInfo.players_) {
        const index = parsedData.matchInfo.players_.indexOf(player);
        if (index < 5) {
          const heroKey = `radiantHero${index}`;
          const playerKey = `radiantPlayer${index}`;
          dataToSaveForSummary[heroKey] = player.heroName_;
          dataToSaveForSummary[playerKey] = player.playerName_;
        } else {
          const heroKey = `direHero${index - 5}`;
          const playerKey = `direPlayer${index - 5}`;
          dataToSaveForSummary[heroKey] = player.heroName_;
          dataToSaveForSummary[playerKey] = player.playerName_;
        }
      }

      dataToSaveForSummary.gameWinner = parsedData.matchInfo.gameWinner_;
      dataToSaveForSummary.endTime = parsedData.matchInfo.endTime_;
      dataToSaveForSummary.duration = parsedData.matchInfo.playbackTime_;

      const kills = this.getKills(dataToSaveForSummary, parsedData);
      dataToSaveForSummary.radiantKills = kills.radiantKills.length;
      dataToSaveForSummary.direKills = kills.direKills.length;

      // Check if match already exists to update instead of insert
      const existingMatch = await this.matchSummaryRepo.findOne({
        where: { match_id: matchId },
      });
      if (existingMatch) {
        dataToSaveForSummary.id = existingMatch.id;
      }

      const inserted = await this.matchSummaryRepo.save(dataToSaveForSummary);

      // Check if match details already exist
      const existingDetails = await this.matchDetailsRepo.findOne({
        where: { match_id: matchId },
      });
      await this.matchDetailsRepo.save({
        id: existingDetails?.id,
        match_id: matchId,
        match_content: matchContent,
      });

      return inserted;
    } catch (err) {
      throw err;
    }
  }

  getKills(dataToSaveForSummary: { [x: string]: any; }, parsedData: { [x: string]: any; }) {
    let kills = parsedData['DOTA_COMBATLOG_DEATH'];
    kills = kills.filter((k: { attackerhero: any; targethero: any; }) => k.attackerhero && k.targethero);

    let radiantKills = kills.filter((k: { attackername: any; }) => {
      if (dataToSaveForSummary['radiantHero0'] === k.attackername) {
        return k;
      }
      if (dataToSaveForSummary['radiantHero1'] === k.attackername) {
        return k;
      }
      if (dataToSaveForSummary['radiantHero2'] === k.attackername) {
        return k;
      }
      if (dataToSaveForSummary['radiantHero3'] === k.attackername) {
        return k;
      }
      if (dataToSaveForSummary['radiantHero4'] === k.attackername) {
        return k;
      }
    });

    radiantKills = radiantKills.filter((k: { attackername: any; targetname: any; }) => k.attackername !== k.targetname);

    let direKills = kills.filter((k: { attackername: any; }) => {
      if (dataToSaveForSummary['direHero0'] === k.attackername) {
        return k;
      }
      if (dataToSaveForSummary['direHero1'] === k.attackername) {
        return k;
      }
      if (dataToSaveForSummary['direHero2'] === k.attackername) {
        return k;
      }
      if (dataToSaveForSummary['direHero3'] === k.attackername) {
        return k;
      }
      if (dataToSaveForSummary['direHero4'] === k.attackername) {
        return k;
      }
    });

    direKills = direKills.filter((k: { attackername: any; targetname: any; }) => k.attackername !== k.targetname);

    return {
      radiantKills,
      direKills,
    };
  }

  myParse(opendotaArray: string[]) {
    const data: any = { types: [] };
    for (const line of opendotaArray) {
      const json = JSON.parse(line);
      if (json.type === 'epilogue') {
        data.matchInfo = getMatchInfo(json);
        return data;
      }

      if (!data.hasOwnProperty(json.type)) {
        data[json.type] = [];
        data.types.push(json.type);
      }

      data[json.type].push(json);
    }
    return data;
  }
}

const getMatchInfo = (o: { key: string; }) => {
  const parsedKey = JSON.parse(o.key);

  const { playbackTime_, playbackTicks_ } = parsedKey as any;
  const { endTime_, gameMode_, gameWinner_, leagueid_, matchId_ } =
    parsedKey.gameInfo_.dota_;
  const players_ = parsedKey.gameInfo_.dota_.playerInfo_;

  realName(players_);

  return {
    playbackTime_,
    playbackTicks_,
    endTime_,
    gameMode_,
    gameWinner_,
    leagueid_,
    matchId_,
    players_,
  };
};

function realName(players_: any[]) {
  players_.forEach((p, i, a) => {
    a[i].heroName_ = String.fromCharCode.apply(null, p.heroName_.bytes);
    a[i].playerName_ = String.fromCharCode.apply(null, p.playerName_.bytes);
  });
}
