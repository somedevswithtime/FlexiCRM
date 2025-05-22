"use client";

import type { Player } from "@typeDefs/dndCRM";

interface PlayerTableProps {
  players: Player[];
  onSelect: (id: string) => void;
}

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
              <td className="px-4 py-2">{player.name}</td>
              <td className="px-4 py-2">{player.class}</td>
              <td className="px-4 py-2">{player.campaign}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
