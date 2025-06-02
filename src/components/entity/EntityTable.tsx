"use client";

import type {
  EntityInstance,
  EntitySchema,
  TypedFieldValue,
} from "@/src/core/types";
import { getDisplayValue } from "@utils"; // Assuming @utils is a valid alias

interface EntityTableProps {
  entities: EntityInstance[]; // Renamed from 'players'
  schema: EntitySchema;
  onSelectEntity: (id: string) => void; // Renamed from 'onSelect'
}

export function EntityTable({
  entities,
  schema,
  onSelectEntity,
}: EntityTableProps) {
  // Renamed component and props
  const tableColumns = schema.fields
    .filter((fieldDef) => fieldDef.isTableColumn === true)
    .sort((a, b) => {
      // Retaining original sort logic, assuming schema.fields is ordered as desired
      return schema.fields.indexOf(a) - schema.fields.indexOf(b);
    });

  return (
    <div className="overflow-x-auto border border-zinc-300 dark:border-zinc-700 rounded">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-zinc-100 dark:bg-zinc-800">
          <tr>
            {tableColumns.map((colDef) => (
              <th key={colDef.id} className="px-4 py-2 font-medium">
                {colDef.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entities.map((entity) => {
            // Renamed from 'player' to 'entity'
            const entityFieldValuesMap = new Map<string, TypedFieldValue>( // Renamed from 'playerFieldValuesMap'
              entity.field_values.map((fv) => [fv.fieldId, fv])
            );
            return (
              <tr
                key={entity.id}
                className="cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700"
                onClick={() => onSelectEntity(entity.id)} // Updated to use onSelectEntity
              >
                {tableColumns.map((colDef) => {
                  const fieldValue = entityFieldValuesMap.get(colDef.id); // Updated to use entityFieldValuesMap
                  return (
                    <td key={colDef.id} className="px-4 py-2">
                      {getDisplayValue(fieldValue, colDef)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
