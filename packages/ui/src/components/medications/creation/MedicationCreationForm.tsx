import {
  type MedicationCommon,
  zodMedicationCommon,
} from "@homethrive-challenge/api/ui-safe-validator-types";
import { DateTime } from "luxon";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Recurrence } from "@homethrive-challenge/api/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc.ts";
import {
  type Dispatch,
  type SetStateAction,
  useLayoutEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button.tsx";
import { formatWeekDayNumber } from "@/utils/format.ts";

export default function MedicationCreateForm({
  formId,
  submitting,
  setSubmitting,
}: {
  formId: string;
  submitting: boolean;
  setSubmitting: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();
  const dosesQueryKey = trpc.getCareRecipientDosesForGivenDate.queryKey();
  const medicationsQueryKey = trpc.getCareRecipientMedicationsById.queryKey();
  const { mutate, isPending: creatingMedication } = useMutation(
    trpc.createMedication.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: dosesQueryKey });
        queryClient.invalidateQueries({ queryKey: medicationsQueryKey });
      },
        onError: (error) => {
            const zodError = error.data?.zodError;
            if (!zodError) return;

            // zodError.fieldErrors: Record<string, string[]>
            Object.entries(zodError.errors).forEach(([field, messages]) => {
                if (!messages || messages.length === 0) return;

                form.setFieldMeta(field as any, meta => ({
                    ...meta,
                    errors: messages,
                    isTouched: true,
                }));
            });
        },
    })
  );

  useLayoutEffect(() => {
    if (submitting !== creatingMedication) setSubmitting(creatingMedication);
  }, [creatingMedication, submitting, setSubmitting]);

  const [displayDaysOfWeek, setDisplayDaysOfWeek] = useState(false);

  const form = useForm({
    defaultValues: {
      careRecipientId: 2193,
      name: "",
      schedule: {
        recurrence: Recurrence.DAILY,
        timeOfDay: 9,
        startDate: DateTime.now().toISODate(),
      },
    } as MedicationCommon,
    validators: {
      onSubmit: zodMedicationCommon,
    },
    onSubmit: async ({value}) => mutate(value),
    listeners: {
      onChange: ({ formApi, fieldApi }) => {
        console.log(formApi.state.values.schedule.daysOfWeek);
        if (fieldApi.name === "schedule.recurrence") {
          const shouldDisplayDaysOfWeek =
            fieldApi.state.value === Recurrence.WEEKLY;
          if (!shouldDisplayDaysOfWeek) {
            formApi.resetField("schedule.daysOfWeek");
          }
          setDisplayDaysOfWeek(shouldDisplayDaysOfWeek);
        }
      },
    },
  });

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <form.Field
        name="name"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Medication Name</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Amoxicillin - 30mg"
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      {/* Schedule Inputs */}
      <form.Field
        name="schedule.recurrence"
        children={(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Recurrence</FieldLabel>
            <Select
              value={field.state.value}
              onValueChange={(val) => field.handleChange(val as Recurrence)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select medication recurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Recurrence</SelectLabel>
                  <SelectItem value={Recurrence.DAILY}>Daily</SelectItem>
                  <SelectItem value={Recurrence.WEEKLY}>Weekly</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </Field>
        )}
      />
      {displayDaysOfWeek && (
        <form.Field
          name="schedule.daysOfWeek"
          mode="array"
          children={(field) => (
            <FieldSet>
              <FieldLegend variant="label">Days of the Week</FieldLegend>
              <FieldDescription>
                Pick at least one day of the week for the medication to be
                taken.
              </FieldDescription>
              <FieldGroup className="flex gap-1 flex-row justify-between">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <Button
                    key={day}
                    type="button"
                    variant={
                      field.state.value?.includes(day) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      if (field.state.value?.includes(day)) {
                        // remove day
                        field.handleChange(
                          field.state.value.filter((d: number) => d !== day)
                        );
                      } else {
                        // add day
                        field.handleChange(
                          [...(field.state.value || []), day].sort()
                        );
                      }
                    }}
                    className="w-12"
                  >
                    {formatWeekDayNumber(day)}
                  </Button>
                ))}
              </FieldGroup>
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </FieldSet>
          )}
        />
      )}
      <form.Field
        name="schedule.timeOfDay"
        children={(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>
              Time of Day (hour, 0-23)
            </FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              min={0}
              max={23}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </Field>
        )}
      />
      <form.Field
        name="schedule.startDate"
        children={(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              type="date"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </Field>
        )}
      />
      <form.Field
        name="schedule.endDate"
        children={(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>End Date (optional)</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              type="date"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </Field>
        )}
      />
      {/* End Schedule Inputs */}
    </form>
  );
}
