var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
let MatchSummary = class MatchSummary {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MatchSummary.prototype, "id", void 0);
__decorate([
    Column('varchar'),
    __metadata("design:type", String)
], MatchSummary.prototype, "match_id", void 0);
__decorate([
    Column('varchar'),
    __metadata("design:type", String)
], MatchSummary.prototype, "radiantHero0", void 0);
__decorate([
    Column('varchar'),
    __metadata("design:type", String)
], MatchSummary.prototype, "radiantHero1", void 0);
__decorate([
    Column('varchar'),
    __metadata("design:type", String)
], MatchSummary.prototype, "radiantHero2", void 0);
__decorate([
    Column('varchar'),
    __metadata("design:type", String)
], MatchSummary.prototype, "radiantHero3", void 0);
__decorate([
    Column('varchar'),
    __metadata("design:type", String)
], MatchSummary.prototype, "radiantHero4", void 0);
__decorate([
    Column('varchar'),
    __metadata("design:type", String)
], MatchSummary.prototype, "direHero0", void 0);
__decorate([
    Column('varchar'),
    __metadata("design:type", String)
], MatchSummary.prototype, "direHero1", void 0);
__decorate([
    Column('varchar'),
    __metadata("design:type", String)
], MatchSummary.prototype, "direHero2", void 0);
__decorate([
    Column('varchar'),
    __metadata("design:type", String)
], MatchSummary.prototype, "direHero3", void 0);
__decorate([
    Column('varchar'),
    __metadata("design:type", String)
], MatchSummary.prototype, "direHero4", void 0);
__decorate([
    Column('int', { nullable: true, default: 0 }),
    __metadata("design:type", Number)
], MatchSummary.prototype, "gameWinner", void 0);
__decorate([
    Column('varchar', { nullable: true, default: '' }),
    __metadata("design:type", String)
], MatchSummary.prototype, "radiantKills", void 0);
__decorate([
    Column('varchar', { nullable: true, default: '' }),
    __metadata("design:type", String)
], MatchSummary.prototype, "direKills", void 0);
__decorate([
    Column('varchar', { nullable: true, default: '' }),
    __metadata("design:type", String)
], MatchSummary.prototype, "endTime", void 0);
MatchSummary = __decorate([
    Entity('match_summary')
], MatchSummary);
export { MatchSummary };
