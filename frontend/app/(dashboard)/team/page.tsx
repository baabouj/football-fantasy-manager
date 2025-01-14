"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { PlayerCard } from "@/components/player-card";

import { axios } from "@/lib/axios";
import type { Team } from "@/lib/types";

export default function TeamManagementPage() {
  const [team, setTeam] = useState<Team>();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get<Team>(`/team`);

        setTeam(res.data);
        clearInterval(interval);
      } catch (error) {
        if (!isAxiosError(error)) {
          clearInterval(interval);
        }
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  if (!team) {
    return <h1 className="text-2xl font-bold">Preparing your team...</h1>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Team Management</h1>
      <div className="text-lg">
        Remaining Budget: £{(team.budget / 1000000).toFixed(2)}M
      </div>
      <div className="space-y-4">
        {["Goalkeeper", "Defender", "Midfielder", "Attacker"].map(
          (position) => (
            <div key={position}>
              <h2 className="text-xl font-semibold mb-2">{position}s</h2>
              <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.players
                  .filter((player) => player.position === position)
                  .map((player) => (
                    <PlayerCard
                      key={player.id}
                      name={player.name}
                      position={player.position}
                      price={player.price}
                      actionButton={<Button size="sm">Manage</Button>}
                    />
                  ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
