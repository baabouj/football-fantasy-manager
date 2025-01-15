"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

import { PlayerCard } from "@/components/player-card";
import { FilterBar, type Filters } from "@/components/filter-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransferLoading from "./loading";

import { useToast } from "@/hooks/use-toast";
import { useTeamsStore } from "@/data/team";

import { axios } from "@/lib/axios";
import { type Player } from "@/lib/types";

export default function TransferMarketPage() {
  const router = useRouter();

  const { setTeam } = useTeamsStore();
  const { toast } = useToast();

  const [players, setPlayers] = useState<Player[]>();
  const [filters, setFilters] = useState<Filters>();

  useEffect(() => {
    async function fetchTransfers() {
      try {
        const { data } = await axios.get<Player[]>("/transfers", {
          params: filters,
        });

        setPlayers(data);
      } catch {
        router.push("/");
      }
    }
    fetchTransfers();
  }, [filters, router]);

  const buyPlayer = async (playerId: string) => {
    try {
      await axios.patch<Player>(`/transfers/${playerId}`);
      setTeam(undefined);
      router.push("/team");
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.status === 400)
          toast({
            description: error.response?.data.message,
            variant: "destructive",
          });
        if (error.status === 401) router.push("/");
      } else
        toast({
          description: "Something went wrong",
          variant: "destructive",
        });
    }
  };

  if (!players) {
    return <TransferLoading />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transfer Market</h1>
      <Card>
        <CardHeader>
          <CardTitle>Filter Players</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterBar onFilter={setFilters} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Available Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => (
              <PlayerCard
                key={player.id}
                name={player.name}
                position={player.position}
                price={player.askingPrice}
                form={player.form}
                team={player.team?.name}
                actionButton={
                  <Button
                    size="sm"
                    onClick={async () => await buyPlayer(player.id)}
                  >
                    Buy
                  </Button>
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
