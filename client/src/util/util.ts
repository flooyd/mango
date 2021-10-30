import moment from 'moment';

function getValveName(heroName) {
  heroName = heroName.replace('npc_dota_hero_', '');
  heroName = heroName.replace('CDOTA_Unit_Hero', '');
  return heroName;
}

function getEndDateAndTimeObject(time: number) {
  return {
    endDate: moment.unix(time).format('MM-DD-YYYY'),
    endTime: moment.unix(time).format('HH:mm:ss A'),
  };
}

function getGameWinnerObject(winner: number) {
  if (winner === 2) {
    {
      return { string: 'Radiant Victory', class: 'radiant' }
    }
  } else {
    {
      return { string: 'Dire Victory', class: 'dire' }
    }
  }
}

export default {
  getValveName,
  getEndDateAndTimeObject,
  getGameWinnerObject,
};
