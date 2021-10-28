function getValveName(heroName) {
  heroName = heroName.replace('npc_dota_hero_', '');
  return heroName;
}

export default {
  getValveName,
}
