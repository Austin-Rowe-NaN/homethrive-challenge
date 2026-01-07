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
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc.ts";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { formatHour } from "@/utils/format.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import {Check} from "lucide-react";

export default function DosesCard() {
  const {
    isFetching: isFetchingMedications,
    data: medications,
    error: medicationsFetchError,
  } = useQuery(
    trpc.getCareRecipientMedicationsById.queryOptions(2193, {
      refetchOnWindowFocus: false,
      retry: 3,
    })
  );
  const {
    isFetching: isFetchingDoses,
    data: doses,
    error: dosesFetchError,
  } = useQuery(
    trpc.getCareRecipientDosesForGivenDate.queryOptions(
      {
        careRecipientId: 2193,
        date: DateTime.now().startOf("day").toISO(),
      },
      {
        refetchOnWindowFocus: false,
        retry: 3,
      }
    )
  );
  const fetching = isFetchingMedications || isFetchingDoses;
  const doseObjects = useMemo(() => {
    if (
      fetching ||
      !doses ||
      doses.length === 0 ||
      !medications ||
      medications.length === 0
    )
      return [];
    return doses
      .map((dose) => {
        const medication = medications.find(
          (med) => med._id === dose.medicationId
        );
        if (!medication) return null;
        return {
          ...dose,
          medication,
        };
      })
      .filter(Boolean) as unknown as [
      (typeof doses)[0] & { medication: (typeof medications)[0] }
    ];
  }, [doses, medications, fetching]);
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
          {medicationsFetchError || dosesFetchError ? (
            <div className="text-destructive text-xl">
              Error:{" "}
              {dosesFetchError?.message || medicationsFetchError?.message}
            </div>
          ) : (
            <ItemGroup className="gap-2">
              {!fetching ? (
                doseObjects.length === 0 ? (
                  <div className="text-muted-foreground text-center w-full py-4">
                    No doses scheduled for this date.
                  </div>
                ) : (
                  doseObjects.map((doseObject) => (
                    <Item variant="muted" className="w-full py-2">
                      <ItemContent>
                        <ItemTitle>{doseObject.medication.name}</ItemTitle>
                        <ItemDescription>
                          {formatHour(doseObject.medication.schedule.timeOfDay)}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                          {doseObject.completed? (
                            <Button className="bg-chart-5 hover:bg-chart-5"><Check /> Taken</Button>
                          ) : (
                              <Button>Mark as taken</Button>
                          )}
                      </ItemActions>
                    </Item>
                  ))
                )
              ) : (
                Array(7)
                  .fill(null)
                  .map(() => (
                    <Item
                      variant="muted"
                      className="w-full py-2 flex justify-between"
                    >
                      <div className="grow">
                        <Skeleton className="w-1/4 h-9" />
                        <Skeleton className="w-1/2 h-6" />
                      </div>
                      <Skeleton className="w-20 h-8" />
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
