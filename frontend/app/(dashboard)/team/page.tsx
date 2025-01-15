"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { PlayerCard } from "@/components/player-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { axios } from "@/lib/axios";
import type { Player, Team } from "@/lib/types";

import { useTeamsStore } from "@/data/team";

export default function TeamManagementPage() {
  const { team, setTeam } = useTeamsStore();

  const [askingPrice, setAskingPrice] = useState<number>();

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
  }, [setTeam]);

  if (!team) {
    return <h1 className="text-2xl font-bold">Preparing your team...</h1>;
  }

  async function addPlayerToTransferList(
    playerId: string,
    askingPrice: number
  ) {
    const { data } = await axios.post<Player>(`/transfers/${playerId}`, {
      askingPrice,
    });
    setTeam({
      ...team!,
      players: team!.players.map((p) => (p.id === playerId ? data : p)),
    });
  }

  async function removePlayerFromTransferList(playerId: string) {
    const { data } = await axios.delete<Player>(`/transfers/${playerId}`);
    setTeam({
      ...team!,
      players: team!.players.map((p) => (p.id === playerId ? data : p)),
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Team Management</h1>
      <div className="text-lg">
        Remaining Budget: ${(team.budget / 1000000).toFixed(2)}M
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
                      isInTransferList={player.isInTransferList}
                      actionButton={
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">Manage</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{player.name}</DialogTitle>
                            </DialogHeader>
                            {!player.isInTransferList && (
                              <div className="space-y-2">
                                <Label
                                  htmlFor="asking_price"
                                  className="font-medium"
                                >
                                  Asking Price
                                </Label>
                                <Input
                                  id="asking_price"
                                  type="number"
                                  placeholder="Enter your asking price"
                                  value={askingPrice}
                                  onChange={(e) =>
                                    setAskingPrice(e.target.valueAsNumber)
                                  }
                                  defaultValue={player.price}
                                  required
                                />
                              </div>
                            )}
                            <DialogFooter>
                              <DialogClose asChild>
                                {player.isInTransferList ? (
                                  <Button
                                    variant="destructive"
                                    onClick={async () =>
                                      await removePlayerFromTransferList(
                                        player.id
                                      )
                                    }
                                  >
                                    Remove from the transfer list
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={async () =>
                                      await addPlayerToTransferList(
                                        player.id,
                                        askingPrice ?? player.price
                                      )
                                    }
                                  >
                                    Add to the transfer list
                                  </Button>
                                )}
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      }
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
