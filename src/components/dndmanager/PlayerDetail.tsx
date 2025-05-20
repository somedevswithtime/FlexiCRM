"use client";

import type { Player } from "@lib/dndmanager/types";

interface PlayerDetailProps {
  player: Player;
}

export function PlayerDetail({ player }: PlayerDetailProps) {
  return (
    <div className="border border-zinc-300 dark:border-zinc-700 rounded p-4">
      <h2 className="text-xl font-semibold mb-2">
        {player.name}'s Character Sheet
      </h2>
      <p>
        <strong>Class:</strong> {player.class}
      </p>
      <p>
        <strong>Race:</strong> {player.race}
      </p>
      <p>
        <strong>Level:</strong> {player.level}
      </p>
      <p>
        <strong>Campaign:</strong> {player.campaign}
      </p>
      <div className="mt-4">
        <h3 className="font-medium">Stats:</h3>
        <ul className="list-disc list-inside">
          {Object.entries(player.stats).map(([stat, value]) => (
            <li key={stat}>
              <strong>{stat}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
