"use client";

import { useState } from "react";
import { PlayerTable } from "@components/dndmanager/PlayerTable";
import { PlayerDetail } from "@components/dndmanager/PlayerDetail";
import { mockedPlayers } from "@lib/dndCRM/data";

export default function DnDManagerPage() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const selectedPlayer =
    mockedPlayers.find((p) => p.id === selectedPlayerId) || null;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-6">
      <h1 className="text-2xl font-bold mb-4">D&D Player Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlayerTable players={mockedPlayers} onSelect={setSelectedPlayerId} />
        {selectedPlayer && <PlayerDetail player={selectedPlayer} />}
      </div>
    </main>
  );
}
