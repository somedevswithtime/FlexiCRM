import type { EntitySchema } from "@/src/core/types";
/**
 * Ideally, should be defined on backend or stored.
 * Hardcoded in for mvp.
 */
export const playerSchema: EntitySchema = {
  id: "player_schema_v001",
  name: "Player Character",
  createdAt: Date.now(), // questionable
  description: "Represents a player character in a D&D campaign.",
  fields: [
    {
      id: "player_field_name",
      name: "Character Name",
      type: "text",
      isRequired: true,
      description: "The character's in-game name.",
      uiGroup: "Basic Info",
      isTableColumn: true,
      defaultSortOrder: "asc",
      uiControlType: "text",
    },
    {
      id: "player_field_class",
      name: "Class",
      type: "enum",
      isRequired: true,
      description: "The character's class.",
      uiGroup: "Basic Info",
      isTableColumn: true,
      uiControlType: "select",
      options: [
        { id: "cl_fighter", name: "Fighter" },
        { id: "cl_mage", name: "Mage" },
        { id: "cl_rogue", name: "Rogue" },
        { id: "cl_cleric", name: "Cleric" },
      ],
    },
    {
      id: "player_field_race",
      name: "Race",
      type: "enum",
      isRequired: true,
      description: "The character's race.",
      uiGroup: "Basic Info",
      isTableColumn: false,
      uiControlType: "select",
      options: [
        { id: "rc_human", name: "Human" },
        { id: "rc_elf", name: "Elf" },
        { id: "rc_dwarf", name: "Dwarf" },
        { id: "rc_halfling", name: "Halfling" },
      ],
    },
    {
      id: "player_field_level",
      name: "Level",
      type: "number",
      isRequired: true,
      description: "The character's current level.",
      uiGroup: "Basic Info",
      isTableColumn: true,
      defaultSortOrder: "desc",
      uiControlType: "number",
    },
    {
      id: "player_field_campaign",
      name: "Campaign",
      type: "text", // Could be a 'relation' if Campaign was another EntitySchema
      description: "The campaign this character belongs to.",
      uiGroup: "Basic Info",
      isTableColumn: true,
      uiControlType: "text",
    },
    // Representing stats: Record<string, number>
    // Option 1: Individual fields for common stats
    {
      id: "player_field_stat_strength",
      name: "Strength",
      type: "number",
      uiGroup: "Stats",
      isTableColumn: false,
      uiControlType: "number",
    },
    {
      id: "player_field_stat_dexterity",
      name: "Dexterity",
      type: "number",
      uiGroup: "Stats",
      isTableColumn: false,
      uiControlType: "number",
    },
    {
      id: "player_field_stat_constitution",
      name: "Constitution",
      type: "number",
      uiGroup: "Stats",
      isTableColumn: false,
      uiControlType: "number",
    },
    {
      id: "player_field_stat_intelligence",
      name: "Intelligence",
      type: "number",
      uiGroup: "Stats",
      isTableColumn: false,
      uiControlType: "number",
    },
    {
      id: "player_field_stat_wisdom",
      name: "Wisdom",
      type: "number",
      uiGroup: "Stats",
      isTableColumn: false,
      uiControlType: "number",
    },
    {
      id: "player_field_stat_charisma",
      name: "Charisma",
      type: "number",
      uiGroup: "Stats",
      isTableColumn: false,
      uiControlType: "number",
    },
    // Option 2: Store as a JSON string in a 'text' field if stats are highly variable
    // (Requires FieldType 'json' to be added for better handling, or use 'text' and parse)
    {
      id: "player_field_stats_json",
      name: "Other Stats (JSON)",
      type: "text", // Ideally 'json' if available
      description:
        "A JSON string representing other character stats (e.g., {'Armor Class': 15, 'Speed': 30}). Requires application-level parsing.",
      uiGroup: "Advanced",
      isTableColumn: false,
      uiControlType: "textarea",
    },
    // If we knew all possible stat keys, we could define them.
    // For truly dynamic Record<string, number>, a JSON string in a text field is a common approach
    // or a more complex field type if the system supports it (e.g. 'keyvaluepairs').
    // Given current FieldTypes, 'text' for JSON is the most flexible for arbitrary stats.
  ],
};
