"use client";

import type {
  EntityInstance,
  EntitySchema,
  FieldDefinition,
  TypedFieldValue,
} from "@core/types";
import { getDisplayValue } from "@utils";

interface PlayerDetailProps {
  player: EntityInstance;
  schema: EntitySchema;
}

interface GroupedField {
  definition: FieldDefinition;
  fieldValue: TypedFieldValue;
}

export function PlayerDetail({ player, schema }: PlayerDetailProps) {
  const fieldDefMap = new Map<string, FieldDefinition>(
    schema.fields.map((field) => [field.id, field])
  );

  // Grouping fields by uiGroup
  const groupedFields: Record<string, GroupedField[]> = {};

  player.field_values.forEach((fv) => {
    const definition = fieldDefMap.get(fv.fieldId);
    if (definition) {
      const groupName = definition.uiGroup || "Other Details";
      if (!groupedFields[groupName]) {
        groupedFields[groupName] = [];
      }
      groupedFields[groupName].push({ definition, fieldValue: fv });
    }
  });

  // preferred order for groups if needed (obj no guarantee for order)
  // kinda hardcoded, need to find a cleaner way
  // todo: refactor the idea
  const groupOrder = ["Basic Info", "Stats", "Other Details"];
  const sortedGroupNames = Object.keys(groupedFields).sort((a, b) => {
    const indexA = groupOrder.indexOf(a);
    const indexB = groupOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1; // a is in order, b is not
    if (indexB !== -1) return 1; // b is in order, a is not
    return a.localeCompare(b); // both are not in order, sort alphabetically
  });

  return (
    <div className="border border-zinc-300 dark:border-zinc-700 rounded p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {player.name || "Character Sheet"}
        </h2>
      </div>

      {sortedGroupNames.map((groupName) => (
        <div key={groupName} className="mb-4">
          <h3 className="text-xl font-medium border-b border-zinc-300 dark:border-zinc-600 pb-1 mb-2">
            {groupName}
          </h3>
          <div className="space-y-1">
            {groupedFields[groupName].map(({ definition, fieldValue }) => (
              <p key={definition.id}>
                <strong>{definition.name}:</strong>{" "}
                {getDisplayValue(fieldValue, definition)}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
