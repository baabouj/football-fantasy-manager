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
  askingPrice: number;
  teamId: string;
  isInTransferList: boolean;
};

export type Position = "Goalkeeper" | "Defender" | "Midfielder" | "Attacker";
