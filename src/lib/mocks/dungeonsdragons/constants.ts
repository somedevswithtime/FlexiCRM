import type { EntityInstance } from "@/src/core/types";

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
