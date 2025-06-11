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
let MatchDetails = class MatchDetails {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MatchDetails.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], MatchDetails.prototype, "match_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], MatchDetails.prototype, "match_content", void 0);
MatchDetails = __decorate([
    Entity('match_details')
], MatchDetails);
export { MatchDetails };
