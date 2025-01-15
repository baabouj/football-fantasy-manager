import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type PlayerCardProps = {
  name: string;
  position: string;
  price: number;
  team?: string;
  form: number;
  isInTransferList?: boolean;
  actionButton: React.ReactNode;
};

export function PlayerCard({
  name,
  position,
  price,
  team,
  form,
  isInTransferList,
  actionButton,
}: PlayerCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex-grow p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
          <div>
            <h3 className="font-bold text-lg mb-1">{name}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{position}</Badge>
              {isInTransferList && (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800"
                >
                  Transfer Listed
                </Badge>
              )}
            </div>
          </div>
          <Badge variant="outline" className="text-sm mt-2 sm:mt-0">
            Form: {form}
          </Badge>
        </div>
        {team && (
          <p className="text-sm text-muted-foreground mb-1 capitalize">
            Team: {team}
          </p>
        )}
        <p className="font-semibold text-primary mb-2">
          ${(price / 1_000_000).toFixed(2)}M
        </p>
        <Progress value={form} className="h-1.5" />
      </CardContent>
      <CardFooter className="p-2">{actionButton}</CardFooter>
    </Card>
  );
}
