var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpStatus, Injectable } from '@nestjs/common';
import { windowManager } from 'node-window-manager';
import * as robotjs from 'robotjs';
import * as ncp from 'copy-paste';
let NavigationService = class NavigationService {
    constructor() {
        this.dota2Window = null;
        this.dota2Window = null;
        robotjs.setKeyboardDelay(1);
    }
    getDota2Window() {
        const windows = windowManager.getWindows();
        const uniquePaths = [];
        for (const window of windows) {
            if (!uniquePaths.includes(window.path))
                uniquePaths.push(window.path);
        }
        this.dota2Window = windows.find((window) => window.path.includes('dota2.exe'));
        if (this.dota2Window) {
            return {
                status: 'ok',
                dotaScreen: 'Main Menu',
            };
        }
        else {
            return {
                status: 'no dota',
            };
        }
    }
    bringToTop() {
        this.dota2Window.bringToTop();
        console.log('hi');
        return HttpStatus.OK;
    }
    close() {
        console.log('hi');
        return HttpStatus.OK;
    }
    async openReplay(matchId) {
        this.dota2Window.bringToTop();
        ncp.copy(`playdemo replays/${matchId}`, () => {
            robotjs.keyTap('f6');
            setTimeout(() => {
                robotjs.keyTap('a', ['control']);
                robotjs.keyTap('backspace');
                robotjs.keyTap('v', ['control']);
                robotjs.keyTap('enter');
                robotjs.keyTap('f6');
            }, 500);
        });
        return HttpStatus.OK;
    }
    gotoTick(tick) {
        this.dota2Window.bringToTop();
        ncp.copy(`demo_gototick ${tick - 150}`, () => {
            robotjs.keyTap('f6');
            robotjs.keyTap('a', ['control']);
            robotjs.keyTap('backspace');
            robotjs.keyTap('v', ['control']);
            robotjs.keyTap('enter');
            robotjs.keyTap('f6');
        });
        return HttpStatus.OK;
    }
};
NavigationService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], NavigationService);
export { NavigationService };
