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
  const fieldDefMap = new Map<string, FieldDefinition>(
    schema.fields.map((field) => [field.id, field])
  );

  const groupedFields: Record<string, GroupedField[]> = {};
  entity.field_values.forEach((fv) => {
    const definition = fieldDefMap.get(fv.fieldId);
    if (definition) {
      const groupName = definition.uiGroup || "Details";
      if (!groupedFields[groupName]) {
        groupedFields[groupName] = [];
      }
      groupedFields[groupName].push({ definition, fieldValue: fv });
    }
  });

  const sortedGroupNames = Object.keys(groupedFields).sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          {entity.name || `${schema.name} Details`}
        </h2>
      </div>

      {sortedGroupNames.map((groupName) => (
        <div key={groupName}>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-600 pb-2 mb-4">
            {groupName}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedFields[groupName].map(({ definition, fieldValue }) => (
              <div key={definition.id} className="flex flex-col p-2 rounded-md">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {definition.name}
                </span>
                <span className="text-md text-gray-800 dark:text-white">
                  {getDisplayValue(fieldValue, definition)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
