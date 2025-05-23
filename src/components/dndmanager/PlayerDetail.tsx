"use client";

import { filterFieldValuesByFieldIdSubstrings as filterBySubstrings } from "@lib/functions";
import type { EntityInstance } from "@typeDefs/core";

interface PlayerDetailProps {
  player: EntityInstance;
}

export function PlayerDetail({ player }: PlayerDetailProps) {
  // TODO: kinda hacky, need to think how to do a generic detail page
  const playerMainDetails = filterBySubstrings(
    ["class", "race", "level", "campaign"],
    player.fieldValues
  );
  const playerStats = filterBySubstrings(["stat"], player.fieldValues);
  return (
    <div className="border border-zinc-300 dark:border-zinc-700 rounded p-4">
      <h2 className="text-xl font-semibold mb-2">
        {player.name}'s Character Sheet
      </h2>
      {playerMainDetails.map(({ name, value, fieldId }) => (
        <p key={fieldId}>
          <strong>{name}:</strong> {value}
        </p>
      ))}
      <div className="mt-4">
        <h3 className="font-medium">Stats:</h3>
        <ul className="list-disc list-inside">
          {playerStats.map(({ name, fieldId, value }) => (
            <li key={fieldId}>
              <strong>{name}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
