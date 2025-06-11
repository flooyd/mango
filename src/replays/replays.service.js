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
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchDetails } from '../Entities/matchdetails.entity';
import { Repository } from 'typeorm';
import bent from 'bent';
import { MatchSummary } from '../Entities/matchsummary.entity';
let ReplaysService = class ReplaysService {
    constructor(matchDetailsRepo, matchSummaryRepo) {
        this.matchDetailsRepo = matchDetailsRepo;
        this.matchSummaryRepo = matchSummaryRepo;
        this.replayDirectory = 'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/replays';
        this.replayDirectoryUbuntu = '/home/floyd/.local/share/Steam/steamapps/common/dota 2 beta/game/dota/replays';
    }
    async getReplays() {
        let files = await fs.promises.readdir(this.replayDirectory);
        files = files.filter((file) => file != 'placeholder.txt');
        return files.map((file) => {
            return file.split('.')[0];
        });
    }
    async saveParsedReplay(matchId) {
        const file = fs.readFileSync(`${this.replayDirectory}/${matchId}.dem`);
        const post = bent('http://localhost:5600', 'POST', 'buffer', 200);
        try {
            const response = await post('/', file);
            const matchContent = response.toString();
            const matchContentArray = matchContent.split('\n');
            const parsedData = await this.myParse(matchContentArray);
            const dataToSaveForSummary = {
                match_id: matchId,
            };
            for (const player of parsedData.matchInfo.players_) {
                const index = parsedData.matchInfo.players_.indexOf(player);
                if (index < 5) {
                    const key = `radiantHero${index}`;
                    dataToSaveForSummary[key] = player.heroName_;
                }
                else {
                    const key = `direHero${index - 5}`;
                    dataToSaveForSummary[key] = player.heroName_;
                }
            }
            dataToSaveForSummary.gameWinner = parsedData.matchInfo.gameWinner_;
            dataToSaveForSummary.endTime = parsedData.matchInfo.endTime_;
            const kills = this.getKills(dataToSaveForSummary, parsedData);
            dataToSaveForSummary.radiantKills = kills.radiantKills.length;
            dataToSaveForSummary.direKills = kills.direKills.length;
            const inserted = await this.matchSummaryRepo.save(dataToSaveForSummary);
            await this.matchDetailsRepo.save({
                match_id: matchId,
                match_content: matchContent,
            });
            return inserted;
        }
        catch (err) {
            throw err;
        }
    }
    getKills(dataToSaveForSummary, parsedData) {
        let kills = parsedData['DOTA_COMBATLOG_DEATH'];
        kills = kills.filter((k) => k.attackerhero && k.targethero);
        let radiantKills = kills.filter((k) => {
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
        radiantKills = radiantKills.filter((k) => k.attackername !== k.targetname);
        let direKills = kills.filter((k) => {
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
        direKills = direKills.filter((k) => k.attackername !== k.targetname);
        return {
            radiantKills,
            direKills,
        };
    }
    myParse(opendotaArray) {
        const data = { types: [] };
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
};
ReplaysService = __decorate([
    Injectable(),
    __param(0, InjectRepository(MatchDetails)),
    __param(1, InjectRepository(MatchSummary)),
    __metadata("design:paramtypes", [Repository,
        Repository])
], ReplaysService);
export { ReplaysService };
const getMatchInfo = (o) => {
    const parsedKey = JSON.parse(o.key);
    const { playbackTime_, playbackTicks_ } = parsedKey;
    const { endTime_, gameMode_, gameWinner_, leagueid_, matchId_ } = parsedKey.gameInfo_.dota_;
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
function realName(players_) {
    players_.forEach((p, i, a) => {
        a[i].heroName_ = String.fromCharCode.apply(null, p.heroName_.bytes);
        a[i].playerName_ = String.fromCharCode.apply(null, p.playerName_.bytes);
    });
}
