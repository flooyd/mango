import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class ReplaysService {
  async getReplays() {
    const replayDirectory =
      'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/replays';
    let files = await fs.promises.readdir(replayDirectory);
    files = files.filter((file) => file != 'placeholder.txt');
    return files.map((file) => {
      return file.split('.')[0];
    });
  }
}
