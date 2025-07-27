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
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {tableColumns.map((colDef) => (
              <th
                key={colDef.id}
                className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
              >
                {colDef.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {entities.map((entity) => {
            const entityFieldValuesMap = new Map<string, TypedFieldValue>(
              entity.field_values.map((fv) => [fv.fieldId, fv])
            );
            return (
              <tr
                key={entity.id}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={() => onSelectEntity(entity.id)}
              >
                {tableColumns.map((colDef) => {
                  const fieldValue = entityFieldValuesMap.get(colDef.id);
                  return (
                    <td key={colDef.id} className="px-6 py-4 whitespace-nowrap">
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
