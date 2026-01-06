import NavBar from "@/components/NavBar.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
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
import { PlusIcon } from "lucide-react";

/*
TODO - Make this mobile friendly
TODO - Integrate with API
TODO - Organize into smaller components
 */
export default function App() {
  return (
    <div>
      <NavBar />
      <Button size="icon-lg" className="absolute bottom-10 right-10">
        <PlusIcon />
      </Button>
      <div className="flex justify-center">
        <div className="flex justify-between container py-6 gap-6">
          <Card className="max-h-[85vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Medications</CardTitle>
              <CardAction>
                <Button size="icon-sm">
                  <PlusIcon />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <ItemGroup className="gap-2">
                {Array(7)
                  .fill(null)
                  .map(() => (
                    <Item
                      variant="muted"
                      className="w-52 py-2 max-w-full min-w-52"
                    >
                      <ItemContent>
                        <ItemTitle>Medication Name</ItemTitle>
                        <ItemDescription>Medication Date Range</ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
              </ItemGroup>
            </CardContent>
          </Card>
          <Card className="grow">
            <CardHeader>
              <CardTitle className="text-2xl">Dosage Schedule</CardTitle>
              <CardAction>
                <DatePicker defaultDate={new Date()} />
              </CardAction>
            </CardHeader>
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
          </Card>
        </div>
      </div>
    </div>
  );
}
