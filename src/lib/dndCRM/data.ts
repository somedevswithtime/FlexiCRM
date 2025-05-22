import type { Player } from "../../types/dndCRM/types";

export const mockPlayers: Player[] = [
  {
    id: "1",
    name: "Thalia",
    class: "Wizard",
    race: "Elf",
    level: 5,
    campaign: "Echoes of Eldar",
    stats: {
      Strength: 8,
      Dexterity: 14,
      Constitution: 12,
      Intelligence: 18,
      Wisdom: 13,
      Charisma: 10,
    },
  },
  {
    id: "2",
    name: "Garruk",
    class: "Barbarian",
    race: "Half-Orc",
    level: 6,
    campaign: "Shadows of Thar",
    stats: {
      Strength: 18,
      Dexterity: 12,
      Constitution: 16,
      Intelligence: 8,
      Wisdom: 10,
      Charisma: 9,
    },
  },
];
