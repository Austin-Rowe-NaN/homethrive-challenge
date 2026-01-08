// WARNING: THIS CANNOT IMPORT ANY LOGIC FROM ANYWHERE EXCEPT @homethrive-challenge/api/types
// IT MUST BE SAFE TO IMPORT IN THE packages/ui workspace
import { z } from "zod";
import { Recurrence } from "@homethrive-challenge/api/types";

export const zodMedicationScheduleCommon = z
  .object({
    recurrence: z.enum(Recurrence),
    timeOfDay: z.number().min(0).max(23),
    daysOfWeek: z.array(z.number().int().min(1).max(6)).optional(),
    startDate: z.iso.date(),
    endDate: z.iso.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.recurrence === Recurrence.WEEKLY && !data.daysOfWeek) {
      ctx.addIssue({
        code: "custom",
        message: "daysOfWeek is required when recurrence is WEEKLY",
        path: ["daysOfWeek"],
      });
    }
  });

export type MedicationScheduleCommon = z.infer<
  typeof zodMedicationScheduleCommon
>;

export const zodCareRecipientIdCommon = z.number();

export const zodMedicationCommon = z.object({
  name: z.string().min(1, "Medication name is required!").max(256),
  schedule: zodMedicationScheduleCommon,
  careRecipientId: zodCareRecipientIdCommon,
  completedDoses: z.array(z.iso.date()).optional(),
});

export type MedicationCommon = z.infer<typeof zodMedicationCommon>;

export const zodGetCareRecipientDosesCommon = z.object({
  careRecipientId: zodCareRecipientIdCommon,
  date: z.iso.date(),
});

export const zodAddCompletedDoseInputCommon = z.object({
  medicationId: z.string(),
  doseDate: z.iso.date(),
});
