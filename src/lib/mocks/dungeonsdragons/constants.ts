import type { EntityInstance } from "@/src/core/types";

export const API_URL = "https://flexicrm-backend.onrender.com/api";

export const mockedPlayers: EntityInstance[] = [
  {
    id: "mock_unique_playerId_001",
    createdAt: Date.now(),
    schemaId: "player_schema_v001",
    name: "Thalia",
    field_values: [
      {
        fieldId: "player_field_name",
        name: "Character Name",
        tableVisible: true,
        type: "text",
        value: "Thalia",
      },
      {
        fieldId: "player_field_class",
        name: "Class",
        tableVisible: true,
        type: "text",
        value: "Wizard",
      },
      {
        fieldId: "player_field_race",
        name: "Race",
        type: "text",
        value: "Elf",
      },
      {
        fieldId: "player_field_level",
        name: "Level",
        type: "number",
        value: 5,
      },
      {
        fieldId: "player_field_campaign",
        name: "Campaign",
        tableVisible: true,
        type: "text",
        value: "Echoes of Eldar",
      },
      {
        fieldId: "player_field_stat_strength",
        name: "Strength",
        type: "number",
        value: 8,
      },
      {
        fieldId: "player_field_stat_dexterity",
        name: "Dexterity",
        type: "number",
        value: 14,
      },
      {
        fieldId: "player_field_stat_constitution",
        name: "Constitution",
        type: "number",
        value: 12,
      },
      {
        fieldId: "player_field_stat_intelligence",
        name: "Intelligence",
        type: "number",
        value: 18,
      },
      {
        fieldId: "player_field_stat_wisdom",
        name: "Wisdom",
        type: "number",
        value: 13,
      },
      {
        fieldId: "player_field_stat_charisma",
        name: "Charisma",
        type: "number",
        value: 10,
      },
    ],
  },
  {
    id: "mock_unique_playerId_002",
    createdAt: Date.now(),
    schemaId: "player_schema_v001",
    name: "Garruk",
    field_values: [
      {
        fieldId: "player_field_name",
        name: "Character Name",
        tableVisible: true,
        type: "text",
        value: "Garruk",
      },
      {
        fieldId: "player_field_class",
        name: "Class",
        tableVisible: true,
        type: "text",
        value: "Barbarian",
      },
      {
        fieldId: "player_field_race",
        name: "Race",
        type: "text",
        value: "Half-orc",
      },
      {
        fieldId: "player_field_level",
        name: "Level",
        type: "number",
        value: 6,
      },
      {
        fieldId: "player_field_campaign",
        name: "Campaign",
        tableVisible: true,
        type: "text",
        value: "Shadows of Thar",
      },
      {
        fieldId: "player_field_stat_strength",
        name: "Strength",
        type: "number",
        value: 18,
      },
      {
        fieldId: "player_field_stat_dexterity",
        name: "Dexterity",
        type: "number",
        value: 12,
      },
      {
        fieldId: "player_field_stat_constitution",
        name: "Constitution",
        type: "number",
        value: 16,
      },
      {
        fieldId: "player_field_stat_intelligence",
        name: "Intelligence",
        type: "number",
        value: 8,
      },
      {
        fieldId: "player_field_stat_wisdom",
        name: "Wisdom",
        type: "number",
        value: 10,
      },
      {
        fieldId: "player_field_stat_charisma",
        name: "Charisma",
        type: "number",
        value: 9,
      },
    ],
  },
];
