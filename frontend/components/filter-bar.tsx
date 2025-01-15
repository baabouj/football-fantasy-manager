"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

export type Filters = {
  player: string;
  team: string;
  price: number;
};

type FilterBarProps = {
  onFilter: (filters: Filters) => void;
};

export function FilterBar({ onFilter }: FilterBarProps) {
  const [player, setPlayerName] = useState("");
  const [team, setTeamName] = useState("");
  const [price, setPrice] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ player, team, price: price * 1_000_000 });
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="player">Player Name</Label>
              <Input
                id="player"
                value={player}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter player name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team">Team Name</Label>

              <Input
                id="team"
                value={team}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
              />
            </div>
            <div className="space-y-2">
              <Label>Price Range (in millions)</Label>
              <Slider
                max={20}
                step={0.1}
                value={[price]}
                onValueChange={([value]) => setPrice(value)}
              />
              <div className="flex justify-between text-sm">
                <span>${price}M</span>
                <span>$20M</span>
              </div>
            </div>
          </div>
          <Button type="submit">Apply Filters</Button>
        </form>
      </CardContent>
    </Card>
  );
}
