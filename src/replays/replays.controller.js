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
import { Controller, Get, Param, Post } from '@nestjs/common';
import { ReplaysService } from './replays.service';
let ReplaysController = class ReplaysController {
    constructor(replaysService) {
        this.replaysService = replaysService;
    }
    getReplays() {
        return this.replaysService.getReplays();
    }
    saveParsedReplay(matchId) {
        return this.replaysService.saveParsedReplay(matchId);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReplaysController.prototype, "getReplays", null);
__decorate([
    Post('/:matchId'),
    __param(0, Param('matchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReplaysController.prototype, "saveParsedReplay", null);
ReplaysController = __decorate([
    Controller('replays'),
    __metadata("design:paramtypes", [ReplaysService])
], ReplaysController);
export { ReplaysController };
