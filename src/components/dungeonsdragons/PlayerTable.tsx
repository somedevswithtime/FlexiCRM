"use client";

import type {
  EntityInstance,
  EntitySchema,
  TypedFieldValue,
} from "@/src/core/types";
import { getDisplayValue } from "@utils";

interface PlayerTableProps {
  players: EntityInstance[];
  schema: EntitySchema;
  onSelect: (id: string) => void;
}

export function PlayerTable({ players, schema, onSelect }: PlayerTableProps) {
  const tableColumns = schema.fields
    .filter((fieldDef) => fieldDef.isTableColumn === true) // grabbing only shown
    .sort((a, b) => {
      // Simple sort, wonder if this is too slow in the future
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
          {players.map((player) => {
            const playerFieldValuesMap = new Map<string, TypedFieldValue>(
              player.field_values.map((fv) => [fv.fieldId, fv])
            );
            return (
              <tr
                key={player.id}
                className="cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700"
                onClick={() => onSelect(player.id)}
              >
                {tableColumns.map((colDef) => {
                  const fieldValue = playerFieldValuesMap.get(colDef.id);
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
