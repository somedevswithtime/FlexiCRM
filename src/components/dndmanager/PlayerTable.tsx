"use client";
// Deperecated, todo: remove
// import type { Player } from "@typeDefs/dndCRM";
import type { EntityInstance } from "@typeDefs/core";

interface PlayerTableProps {
  players: EntityInstance[];
  onSelect: (id: string) => void;
}

// TODO: build generic table, layout determined by schema
//       should it be derived by fieldValues?
export function PlayerTable({ players, onSelect }: PlayerTableProps) {
  return (
    <div className="overflow-x-auto border border-zinc-300 dark:border-zinc-700 rounded">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-zinc-100 dark:bg-zinc-800">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Class</th>
            <th className="px-4 py-2">Campaign</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr
              key={player.id}
              className="cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700"
              onClick={() => onSelect(player.id)}
            >
              {player.fieldValues
                .filter(({ tableVisible }) => tableVisible)
                .map(({ fieldId, value }) => (
                  <td key={fieldId} className="px-4 py-2">
                    {value}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
