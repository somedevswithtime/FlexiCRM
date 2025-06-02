"use client";

import type {
  EntityInstance,
  EntitySchema,
  FieldDefinition,
  TypedFieldValue,
} from "@core/types"; // Assuming @core/types is a valid alias
import { getDisplayValue } from "@utils"; // Assuming @utils is a valid alias

interface EntityDetailProps {
  entity: EntityInstance; // Renamed from 'player'
  schema: EntitySchema;
}

interface GroupedField {
  definition: FieldDefinition;
  fieldValue: TypedFieldValue;
}

export function EntityDetail({ entity, schema }: EntityDetailProps) {
  // Renamed component and props
  const fieldDefMap = new Map<string, FieldDefinition>(
    schema.fields.map((field) => [field.id, field])
  );

  // Grouping fields by uiGroup
  const groupedFields: Record<string, GroupedField[]> = {};

  entity.field_values.forEach((fv) => {
    // Renamed from 'player'
    const definition = fieldDefMap.get(fv.fieldId);
    if (definition) {
      const groupName = definition.uiGroup || "Other Details"; // Default group name
      if (!groupedFields[groupName]) {
        groupedFields[groupName] = [];
      }
      groupedFields[groupName].push({ definition, fieldValue: fv });
    }
  });

  // Sort group names alphabetically
  const sortedGroupNames = Object.keys(groupedFields).sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <div className="border border-zinc-300 dark:border-zinc-700 rounded p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {entity.name || `${schema.name} Details`} {/* Generalized title */}
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
