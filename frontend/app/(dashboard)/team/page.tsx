"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAxiosError } from "axios";
import { DollarSign, Users, ClubIcon, ListIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PlayerCard } from "@/components/player-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ManagePlayerDialog } from "@/components/manage-player-dialog";
import TeamLoading from "./loading";

import { axios } from "@/lib/axios";
import type { Team } from "@/lib/types";

import { useTeamsStore } from "@/data/team";

export default function TeamManagementPage() {
  const { team, setTeam } = useTeamsStore();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get<Team>(`/team`);

        setTeam(res.data);
        clearInterval(interval);
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          router.push("/");
        } else {
          clearInterval(interval);
        }
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [router, setTeam]);

  if (!team) {
    return <TeamLoading />;
  }

  const playersInTransferList = team.players.filter(
    (player) => player.isInTransferList
  ).length;
  const averageForm =
    team.players.reduce((sum, player) => sum + player.form, 0) /
    team.players.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold capitalize">{team.name}</h1>
        <Link className="hidden sm:block" href="/transfer">
          <Button>Transfer Market</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(team.budget / 1000000).toFixed(2)}M
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Squad Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.players.length}</div>
            <p className="text-xs text-muted-foreground">
              players in the squad
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Form</CardTitle>
            <ClubIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageForm.toFixed(1)}</div>
            <Progress value={averageForm} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transfer Listed
            </CardTitle>
            <ListIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{playersInTransferList}</div>
            <p className="text-xs text-muted-foreground">
              {playersInTransferList === 1 ? "player" : "players"} in transfer
              list
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Squad Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="h-full">
              <div className="flex flex-wrap">
                <TabsTrigger value="all">All Players</TabsTrigger>
                <TabsTrigger value="goalkeeper">Goalkeepers</TabsTrigger>
                <TabsTrigger value="defender">Defenders</TabsTrigger>
                <TabsTrigger value="midfielder">Midfielders</TabsTrigger>
                <TabsTrigger value="attacker">Attackers</TabsTrigger>
              </div>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    name={player.name}
                    position={player.position}
                    price={player.price}
                    form={player.form}
                    isInTransferList={player.isInTransferList}
                    actionButton={<ManagePlayerDialog player={player} />}
                  />
                ))}
              </div>
            </TabsContent>
            {["goalkeeper", "defender", "midfielder", "attacker"].map(
              (position) => (
                <TabsContent
                  key={position}
                  value={position}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {team.players
                      .filter(
                        (player) => player.position.toLowerCase() === position
                      )
                      .map((player) => (
                        <PlayerCard
                          key={player.id}
                          name={player.name}
                          position={player.position}
                          price={player.price}
                          form={player.form}
                          isInTransferList={player.isInTransferList}
                          actionButton={<ManagePlayerDialog player={player} />}
                        />
                      ))}
                  </div>
                </TabsContent>
              )
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
