import MedicationsDosesCard from "@/components/common/MedicationsDosesCard.tsx";
import {
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "lucide-react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item.tsx";

export default function MedicationsCard() {
  return (
    <MedicationsDosesCard
      cardType="medications"
      cardHeader={
        <CardHeader>
          <CardTitle className="text-2xl">Medications</CardTitle>
          <CardAction>
            <Button size="icon-sm">
              <PlusIcon />
            </Button>
          </CardAction>
        </CardHeader>
      }
      cardContent={
        <CardContent>
          <ItemGroup className="gap-2">
            {Array(7)
              .fill(null)
              .map(() => (
                <Item variant="muted" className="w-full py-2">
                  <ItemContent>
                    <ItemTitle>Medication Name</ItemTitle>
                    <ItemDescription>Medication Date Range</ItemDescription>
                  </ItemContent>
                </Item>
              ))}
          </ItemGroup>
        </CardContent>
      }
    />
  );
}
