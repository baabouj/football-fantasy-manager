import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PlayerCardProps = {
  name: string;
  position: string;
  price: number;
  isInTransferList?: boolean;
  actionButton: React.ReactNode;
};

export function PlayerCard({
  name,
  position,
  price,
  isInTransferList,
  actionButton,
}: PlayerCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">{name}</h3>
          {isInTransferList && <Badge variant="secondary">Transfer list</Badge>}
        </div>
        <p>{position}</p>
        <p className="font-semibold">${(price / 1000000).toFixed(2)}M</p>
      </CardContent>
      <CardFooter>{actionButton}</CardFooter>
    </Card>
  );
}
