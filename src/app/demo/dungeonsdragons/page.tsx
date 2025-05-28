"use client";

import { useState, useEffect } from "react";
import { PlayerTable } from "@/src/components/dungeonsdragons/PlayerTable";
import { PlayerDetail } from "@/src/components/dungeonsdragons/PlayerDetail";
import { mockedPlayers, API_URL } from "@lib/mocks/dungeonsdragons/constants";
import { playerSchema } from "@/src/lib/mocks/dungeonsdragons/schemas";

// todo: refactor, done really quick
// consider utilizing logic in custom hooks maybe
// allow for CORS headers?
export default function DnDManagerPage() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [fetchedSchema, setFetchedSchema] = useState<any | null>(null);
  const selectedPlayer =
    mockedPlayers.find((p) => p.id === selectedPlayerId) || null;

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await fetch(
          `${API_URL}${process.env.NEXT_PUBLIC_DEFAULT_PLAYER_SCHEMA_ID}`
        );
        const result = await response.json();
        setFetchedSchema(result.data);
      } catch (error) {
        console.error("Failed to fetch schema:", error);
        console.log("Loading local player schema.");
        setFetchedSchema(playerSchema);
      }
    };

    fetchSchema();
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-6">
      <h1 className="text-2xl font-bold mb-4">D&D Player Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fetchedSchema && (
          <PlayerTable
            players={mockedPlayers}
            onSelect={setSelectedPlayerId}
            schema={fetchedSchema}
          />
        )}
        {selectedPlayer && fetchedSchema && (
          <PlayerDetail player={selectedPlayer} schema={fetchedSchema} />
        )}
      </div>
    </main>
  );
}
