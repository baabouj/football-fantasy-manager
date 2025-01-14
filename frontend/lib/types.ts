export type User = { id: string; email: string };

export type Team = {
  id: string;
  name: string;
  budget: number;
  ownerId: string;

  players: Player[];
};
export type Player = {
  id: string;
  name: string;
  position: Position;
  price: number;
  teamId: string;
};

export type Position = "Goalkeeper" | "Defender" | "Midfielder" | "Attacker";
