import type { Player } from "@typeDefs/dndCRM";
import type { EntityInstance } from "@typeDefs/core";

// Testing and MVP purposes
export const mockedPlayers: EntityInstance[] = [
  {
    id: "mock_unique_playerId_001", // Maybe unique user id derived from nanoid
    createdAt: Date.now(),
    schemaId: "player_schema_v001", //The ID of the EntitySchema it conforms to (e.g., "taskSchema")
    /** Optional: A primary display name or title for the instance (e.g., "Fix the login bug", "Gandalf").
     * Some entities might derive their name from a specific field.
     */
    name: "Player Character", // Primary display name, title for the instance
    fieldValues: [
      {
        fieldId: "player_field_name",
        name: "Character Name",
        tableVisible: true,
        value: "Thalia",
      },
      {
        fieldId: "player_field_class",
        name: "Class",
        tableVisible: true,
        value: "Wizard",
      },
      {
        fieldId: "player_field_race",
        name: "Race",
        value: "Elf",
      },
      {
        fieldId: "player_field_level",
        name: "Level",
        value: 5,
      },
      {
        fieldId: "player_field_campaign",
        name: "Campaign",
        tableVisible: true,
        value: "Echoes of Eldar",
      },
      {
        fieldId: "player_field_stat_strength",
        name: "Strength",
        value: 8,
      },
      {
        fieldId: "player_field_stat_dexterity",
        name: "Dexterity",
        value: 14,
      },
      {
        fieldId: "player_field_stat_constitution",
        name: "Constitution",
        value: 12,
      },
      {
        fieldId: "player_field_stat_intelligence",
        name: "Intelligence",
        value: 18,
      },
      { fieldId: "player_field_stat_wisdom", name: "Wisdom", value: 13 },
      {
        fieldId: "player_field_stat_charisma",
        name: "Charisma",
        value: 10,
      },
    ],
  },
  {
    id: "mock_unique_playerId_002", // Maybe unique user id derived from nanoid
    createdAt: Date.now(),
    schemaId: "player_schema_v001", //The ID of the EntitySchema it conforms to (e.g., "taskSchema")
    /** Optional: A primary display name or title for the instance (e.g., "Fix the login bug", "Gandalf").
     * Some entities might derive their name from a specific field.
     */
    name: "Player Character", // Primary display name, title for the instance
    fieldValues: [
      {
        fieldId: "player_field_name",
        name: "Character Name",
        tableVisible: true,
        value: "Garruk",
      },
      {
        fieldId: "player_field_class",
        name: "Class",
        tableVisible: true,
        value: "Barbarian",
      },
      {
        fieldId: "player_field_race",
        name: "Race",
        value: "Half-orc",
      },
      {
        fieldId: "player_field_level",
        name: "Level",
        value: 6,
      },
      {
        fieldId: "player_field_campaign",
        name: "Campaign",
        tableVisible: true,
        value: "Shadows of Thar",
      },
      {
        fieldId: "player_field_stat_strength",
        name: "Strength",
        value: 18,
      },
      {
        fieldId: "player_field_stat_dexterity",
        name: "Dexterity",
        value: 12,
      },
      {
        fieldId: "player_field_stat_constitution",
        name: "Constitution",
        value: 16,
      },
      {
        fieldId: "player_field_stat_intelligence",
        name: "Intelligence",
        value: 8,
      },
      { fieldId: "player_field_stat_wisdom", name: "Wisdom", value: 10 },
      {
        fieldId: "player_field_stat_charisma",
        name: "Charisma",
        value: 9,
      },
    ],
  },
];

// DEPRECATED
// TODO: Remove soon
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
