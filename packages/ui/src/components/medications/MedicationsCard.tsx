import MedicationsDosesCard from "@/components/common/MedicationsDosesCard.tsx";
import {CardAction, CardContent, CardHeader, CardTitle,} from "@/components/ui/card.tsx";
import {Item, ItemContent, ItemGroup, ItemTitle,} from "@/components/ui/item.tsx";
import {trpc} from "@/utils/trpc.ts";
import {useQuery} from "@tanstack/react-query";
import {formatMedicationDateRange, formatMedicationDoseInstructions,} from "@/utils/format.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import MedicationsCreationModal from "@/components/medications/creation/MedicationsCreationModal.tsx";

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
              <MedicationsCreationModal />
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
                    <Item
                      variant="muted"
                      className="w-full py-2"
                      key={medication.name}
                    >
                      <ItemContent>
                        <ItemTitle>{medication.name}</ItemTitle>
                        <div className="text-xs text-muted-foreground">
                          <div>{formatMedicationDateRange(medication)}</div>
                          <div>
                            {formatMedicationDoseInstructions(medication)}
                          </div>
                        </div>
                      </ItemContent>
                    </Item>
                  ))
                : Array(7)
                    .fill(null)
                    .map(() => (
                      <Item variant="muted" className="w-full py-2">
                        <ItemContent>
                          <Skeleton className="w-1/3 h-5" />
                          <Skeleton className="w-3/4 h-3.5" />
                          <Skeleton className="w-1/2 h-3.5" />
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
