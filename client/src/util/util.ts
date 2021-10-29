/* eslint-disable prettier/prettier */
import moment from 'moment';

function getValveName(heroName) {
  heroName = heroName.replace('npc_dota_hero_', '');
  heroName = heroName.replace('CDOTA_Unit_Hero', '');
  return heroName;
}

function getEndDateAndTime(time: number) {
  return {
    endDate: moment.unix(time).format("MM-DD-YYYY"),
    endTime: moment.unix(time).format("HH:mm:ss A"),
  }
}

export default {
  getValveName,
  getEndDateAndTime,
};
