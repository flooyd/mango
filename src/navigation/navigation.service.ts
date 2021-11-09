import { HttpStatus, Injectable } from '@nestjs/common';
import { windowManager } from 'node-window-manager';
import * as robotjs from 'robotjs';

@Injectable()
export class NavigationService {
  private dota2Window: any = null;
  constructor() {
    this.dota2Window = null;
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

    const testWindow = windows.find((window) => {
      window.path.includes('dota2.exe');
    });

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
}
