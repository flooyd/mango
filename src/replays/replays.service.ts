import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as bent from 'bent';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchDetails } from 'src/Entities/matchdetails.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReplaysService {
  constructor(
    @InjectRepository(MatchDetails)
    private matchDetailsRepo: Repository<MatchDetails>,
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
      const inserted = await this.matchDetailsRepo.save({
        match_content: response.toString(),
        match_id: matchId,
      });
      return inserted.match_id;
    } catch (err) {
      throw err;
    }
  }
}
