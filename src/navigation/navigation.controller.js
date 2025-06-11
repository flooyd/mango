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
import { Controller, Get, Param } from '@nestjs/common';
import { NavigationService } from './navigation.service';
let NavigationController = class NavigationController {
    constructor(navigationService) {
        this.navigationService = navigationService;
    }
    getDota2Window() {
        return this.navigationService.getDota2Window();
    }
    bringToTop() {
        return this.navigationService.bringToTop();
    }
    openReplay(matchId) {
        this.navigationService.openReplay(matchId);
    }
    gotoTick(tick) {
        this.navigationService.gotoTick(tick);
    }
};
__decorate([
    Get('get-window'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NavigationController.prototype, "getDota2Window", null);
__decorate([
    Get('bring-to-top'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NavigationController.prototype, "bringToTop", null);
__decorate([
    Get('open-replay/:match_id'),
    __param(0, Param('match_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NavigationController.prototype, "openReplay", null);
__decorate([
    Get('goto-tick/:tick'),
    __param(0, Param('tick')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NavigationController.prototype, "gotoTick", null);
NavigationController = __decorate([
    Controller('navigation'),
    __metadata("design:paramtypes", [NavigationService])
], NavigationController);
export { NavigationController };
