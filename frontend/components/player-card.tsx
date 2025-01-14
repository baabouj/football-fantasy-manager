import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface PlayerCardProps {
  name: string;
  position: string;
  price: number;
  actionButton: React.ReactNode;
}

export function PlayerCard({
  name,
  position,
  price,
  actionButton,
}: PlayerCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{name}</h3>
        <p>{position}</p>
        <p className="font-semibold">£{(price / 1000000).toFixed(2)}M</p>
      </CardContent>
      <CardFooter>{actionButton}</CardFooter>
    </Card>
  );
}
