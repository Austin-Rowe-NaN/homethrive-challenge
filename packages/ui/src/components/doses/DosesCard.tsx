import MedicationsDosesCard from "@/components/common/MedicationsDosesCard.tsx";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { DatePicker } from "@/components/ui/date-picker.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function DosesCard() {
  return (
    <MedicationsDosesCard
      cardType="doses"
      cardHeader={
        <CardHeader className="flex justify-between flex-wrap @max-lg/MedicationsCard:justify-center">
          <CardTitle className="text-2xl">Dosage Schedule</CardTitle>
          <DatePicker defaultDate={new Date()} />
        </CardHeader>
      }
      cardContent={
        <CardContent>
          <ItemGroup className="gap-2">
            {Array(4)
              .fill(null)
              .map(() => (
                <Item variant="muted" className="w-full py-2">
                  <ItemContent>
                    <ItemTitle>Medication Name</ItemTitle>
                    <ItemDescription>
                      Medication Instructions (8am)
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button>Taken</Button>
                  </ItemActions>
                </Item>
              ))}
          </ItemGroup>
        </CardContent>
      }
    />
  );
}
