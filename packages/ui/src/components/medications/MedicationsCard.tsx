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
import { trpc } from "@/utils/trpc.ts";
import { useQuery } from "@tanstack/react-query";
import { formatMedicationDateRange } from "@/utils/format.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";

export default function MedicationsCard() {
  const { isFetching, data, error } = useQuery(
    trpc.getCareRecipientMedicationsById.queryOptions(2193, {
      refetchOnWindowFocus: false,
      retry: 1,
    })
  );

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
          {error ? (
            <div className="text-destructive text-xl">
              Error: {error.message}
            </div>
          ) : (
            <ItemGroup className="gap-2">
              {data && data.length > 0 && !isFetching
                ? data.map((medication) => (
                    <Item variant="muted" className="w-full py-2">
                      <ItemContent>
                        <ItemTitle>{medication.name}</ItemTitle>
                        <ItemDescription className="text-xs">
                          {formatMedicationDateRange(medication)}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  ))
                : Array(7)
                    .fill(null)
                    .map(() => (
                      <Item variant="muted" className="w-full py-2">
                        <ItemContent>
                          <Skeleton className="w-1/3 h-6" />
                          <Skeleton className="w-3/4 h-4" />
                        </ItemContent>
                      </Item>
                    ))}
            </ItemGroup>
          )}
        </CardContent>
      }
    />
  );
}
