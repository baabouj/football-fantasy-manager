"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useTeamsStore } from "@/data/team";

import { type Player } from "@/lib/types";
import { axios } from "@/lib/axios";

interface ManagePlayerDialogProps {
  player: Player;
}

export function ManagePlayerDialog({ player }: ManagePlayerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [askingPrice, setAskingPrice] = useState(player.askingPrice);
  const { team, setTeam } = useTeamsStore();

  async function addPlayerToTransferList() {
    const { data } = await axios.post<Player>(`/transfers/${player.id}`, {
      askingPrice,
    });
    setTeam({
      ...team!,
      players: team!.players.map((p) => (p.id === player.id ? data : p)),
    });
    setIsOpen(false);
  }

  async function removePlayerFromTransferList() {
    const { data } = await axios.delete<Player>(`/transfers/${player.id}`);
    setTeam({
      ...team!,
      players: team!.players.map((p) => (p.id === player.id ? data : p)),
    });

    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Player: {player.name}</DialogTitle>
          <DialogDescription>
            {player.isInTransferList
              ? "Remove the player from the transfer list or update the asking price."
              : "Add the player to the transfer list by setting an asking price."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="asking-price" className="text-right">
              Asking Price
            </Label>
            <Input
              id="asking-price"
              type="number"
              value={askingPrice}
              onChange={(e) => setAskingPrice(e.target.valueAsNumber)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          {player.isInTransferList ? (
            <>
              <Button variant="outline" onClick={removePlayerFromTransferList}>
                Remove from Transfer List
              </Button>
              <Button onClick={addPlayerToTransferList}>Update Price</Button>
            </>
          ) : (
            <Button onClick={addPlayerToTransferList}>
              Add to Transfer List
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
