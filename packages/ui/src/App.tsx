import NavBar from "@/components/navigation/NavBar.tsx";
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
import { cn } from "@/lib/utils.ts";
import { useContext } from "react";
import { MobileAppViewContext } from "@/contexts/mobile-app-view-context.tsx";

/*
TODO - Organize into smaller components
TODO - Integrate with API
 */
export default function App() {
  const { mobileView } = useContext(MobileAppViewContext);

  return (
    <div className="h-screen w-screen overflow-hidden @container/App">
      <NavBar />
      <div className="h-[calc(100vh-50px)]">
        <div className="flex h-full justify-between container mx-auto px-4 py-8 gap-6">
          <Card
            className={cn(
              "h-full overflow-y-auto @max-xl/App:w-full @xl/App:basis-1/2 @3xl/App:basis-1/3 @6xl/App:basis-1/4",
              {
                "@max-xl/App:hidden": mobileView === "doses",
              }
            )}
          >
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
                    <Item variant="muted" className="w-full py-2">
                      <ItemContent>
                        <ItemTitle>Medication Name</ItemTitle>
                        <ItemDescription>Medication Date Range</ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
              </ItemGroup>
            </CardContent>
          </Card>
          <Card
            className={cn(
              "@max-xl/App:w-full @xl/App:basis-1/2 @3xl/App:basis-2/3 @6xl/App:basis-3/4 h-full overflow-y-auto @container/MedicationsCard",
              {
                "@max-xl/App:hidden": mobileView === "medications",
              }
            )}
          >
            <CardHeader className="flex justify-between flex-wrap @max-lg/MedicationsCard:justify-center">
              <CardTitle className="text-2xl">Dosage Schedule</CardTitle>
              <DatePicker defaultDate={new Date()} />
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
