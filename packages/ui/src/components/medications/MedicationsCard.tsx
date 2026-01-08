import MedicationsDosesCard from "@/components/common/MedicationsDosesCard.tsx";
import {
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item.tsx";
import { trpc } from "@/utils/trpc.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  formatMedicationDateRange,
  formatMedicationDoseInstructions,
} from "@/utils/format.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import MedicationsCreationModal from "@/components/medications/creation/MedicationsCreationModal.tsx";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";

export default function MedicationsCard() {
  const { isFetching, data, error } = useQuery(
    trpc.getCareRecipientMedicationsById.queryOptions(2193, {
      refetchOnWindowFocus: false,
      retry: 1,
    })
  );

  const queryClient = useQueryClient();
  const dosesQueryKey = trpc.getCareRecipientDosesForGivenDate.queryKey();
  const medicationsQueryKey = trpc.getCareRecipientMedicationsById.queryKey();
  const {
    mutate: markMedicationInactive,
    isPending: markingMedicationInactive,
  } = useMutation(
    trpc.markMedicationInactive.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: dosesQueryKey });
        queryClient.invalidateQueries({ queryKey: medicationsQueryKey });
      },
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
              {!isFetching ? (
                !data || data.length === 0 ? (
                  <div className="text-muted-foreground text-center w-full py-4">
                    No medications found.
                  </div>
                ) : (
                  data.map((medication) => (
                    <Item
                      variant="muted"
                      className={cn("w-full py-2", {
                        "opacity-50": medication.inactive,
                      })}
                      key={medication.name}
                    >
                      <ItemContent>
                        <ItemTitle className="flex justify-between gap-4 w-full">
                          <span>{medication.name}</span>
                          <span>
                            {medication.inactive ? (
                              " (Inactive)"
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  markMedicationInactive(medication._id)
                                }
                                disabled={markingMedicationInactive}
                              >
                                Mark Inactive
                              </Button>
                            )}
                          </span>
                        </ItemTitle>
                        <div className="text-xs text-muted-foreground">
                          <div>{formatMedicationDateRange(medication)}</div>
                          <div>
                            {formatMedicationDoseInstructions(medication)}
                          </div>
                        </div>
                      </ItemContent>
                    </Item>
                  ))
                )
              ) : (
                Array(7)
                  .fill(null)
                  .map(() => (
                    <Item variant="muted" className="w-full py-2">
                      <ItemContent>
                          <div className="flex justify-between gap-4 w-full mb-2">
                              <Skeleton className="w-1/3 h-4" />
                              <Skeleton className="w-1/4 h-5" />
                          </div>
                        <Skeleton className="w-3/4 h-3.5" />
                        <Skeleton className="w-1/2 h-3.5" />
                      </ItemContent>
                    </Item>
                  ))
              )}
            </ItemGroup>
          )}
        </CardContent>
      }
    />
  );
}
