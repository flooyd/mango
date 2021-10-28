import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchDetails } from 'src/Entities/matchdetails.entity';
import { Repository } from 'typeorm';
import bent from 'bent';
import { MatchSummary } from 'src/Entities/matchsummary.entity';

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

  async getReplays() {
    let files = await fs.promises.readdir(this.replayDirectory);
    files = files.filter((file) => file != 'placeholder.txt');
    return files.map((file) => {
      return file.split('.')[0];
    });
  }

  async saveParsedReplay(matchId: string) {
    const file = fs.readFileSync(`${this.replayDirectory}/${matchId}.dem`);
    const options = {
      url: 'http://localhost:5600',
      body: file,
      encoding: null,
    };

    const post = bent('http://localhost:5600', 'POST', 'buffer', 200);
    try {
      const response = await post('/', file);
      const matchContent = response.toString();
      const matchContent_array = matchContent.split('\n');
      const parsedData = await this.myParse(matchContent_array);
      const dataToSaveForSummary = {
        match_id: matchId,
      };

      for (const player of parsedData.matchInfo.players_) {
        const index = parsedData.matchInfo.players_.indexOf(player);
        if (index < 5) {
          const key = `radiantHero${index}`;
          dataToSaveForSummary[key] = player.heroName_;
        } else {
          const key = `direHero${index - 5}`;
          dataToSaveForSummary[key] = player.heroName_;
        }
      }
      const inserted = await this.matchSummaryRepo.save(dataToSaveForSummary);
      await this.matchDetailsRepo.save({
        match_id: matchId,
        match_content: matchContent,
      });

      return inserted;
    } catch (err) {
      throw err;
    }
  }

  myParse(opendotaArray: string[]) {
    const data: any = {};
    console.log('myparse');
    for (const line of opendotaArray) {
      const json = JSON.parse(line);
      if (json.type === 'epilogue') {
        data.matchInfo = getMatchInfo(json);
        return data;
      }
    }
    console.log('endmyparse');
    return data;
  }
}

const getMatchInfo = (o) => {
  o.key = JSON.parse(o.key);

  const { playbackTime_, playbackTicks_ } = o.key;
  const { endTime_, gameMode_, gameWinner_, leagueid_, matchId_ } =
    o.key.gameInfo_.dota_;
  const players_ = o.key.gameInfo_.dota_.playerInfo_;

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

function realName(players_) {
  players_.forEach((p, i, a) => {
    a[i].heroName_ = String.fromCharCode.apply(null, p.heroName_.bytes);
    a[i].playerName_ = String.fromCharCode.apply(null, p.playerName_.bytes);
  });
}
