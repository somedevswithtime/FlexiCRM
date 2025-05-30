"use client";

import { useState, useEffect } from "react";
import { PlayerTable } from "@/src/components/dungeonsdragons/PlayerTable";
import { PlayerDetail } from "@/src/components/dungeonsdragons/PlayerDetail";
// API_URL might need to be adjusted or a new constant created for the base URL
import { API_URL } from "@lib/mocks/dungeonsdragons/constants";
import { playerSchema } from "@/src/lib/mocks/dungeonsdragons/schemas";
import type { EntityInstance } from "@/src/core/types"; // Import EntityInstance type

export default function DnDManagerPage() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [fetchedSchema, setFetchedSchema] = useState<any | null>(null);
  const [players, setPlayers] = useState<EntityInstance[]>([]); // New state for players

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId) || null; // Updated to use players state

  // todo: does it make sense to have it as env?
  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await fetch(
          `${API_URL}/schemas/${process.env.NEXT_PUBLIC_DEFAULT_PLAYER_SCHEMA_ID}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setFetchedSchema(result);
      } catch (error) {
        console.error("Failed to fetch schema:", error);
        console.log("Loading local player schema as fallback.");
        setFetchedSchema(playerSchema); // Fallback to local schema
      }
    };

    fetchSchema();
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(
          `${API_URL}/instances/${process.env.NEXT_PUBLIC_DEFAULT_PLAYER_SCHEMA_ID}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        // Ensure the fetched data is an array, Supabase might return an object with a data property
        setPlayers(Array.isArray(result) ? result : result || []);
      } catch (error) {
        console.error("Failed to fetch players:", error);
        setPlayers([]); // Set to empty array on error
      }
    };

    fetchPlayers();
  }, []); // Empty dependency array to run once on mount

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-6">
      <h1 className="text-2xl font-bold mb-4">D&D Player Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fetchedSchema && (
          <PlayerTable
            players={players} // Pass the new players state
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
