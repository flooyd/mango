import { HttpStatus, Injectable } from '@nestjs/common';
import { windowManager } from 'node-window-manager';
import * as robotjs from 'robotjs';
import ncp from 'copy-paste';

@Injectable()
export class NavigationService {
  private dota2Window: any = null;
  constructor() {
    this.dota2Window = null;
    robotjs.setKeyboardDelay(1);
  }

  getDota2Window() {
    const windows = windowManager.getWindows();
    const uniquePaths = [];

    for (const window of windows) {
      if (!uniquePaths.includes(window.path)) uniquePaths.push(window.path);
    }

    this.dota2Window = windows.find((window) =>
      window.path.includes('dota2.exe'),
    );

    if (this.dota2Window) {
      return {
        status: 'ok',
        dotaScreen: 'Main Menu',
      };
    } else {
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

  async openReplay(matchId: string) {
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

  gotoTick(tick: number) {
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
}
