import { z } from "zod";
import mongoose from "mongoose";
import { Recurrence } from "@homethrive-challenge/api";
import { normalizeDate } from "@homethrive-challenge/api/utils";

const dateStringToDate = z.preprocess(
  (arg) => (typeof arg === "string" ? normalizeDate(arg) : arg),
  z.date()
);

export const zodMedicationSchedule = z
  .object({
    recurrence: z.enum(Recurrence),
    timeOfDay: z.number().min(0).max(23),
    daysOfWeek: z.array(z.number().int().min(1).max(7)).optional(),
    startDate: dateStringToDate,
    endDate: dateStringToDate.optional(),
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

export type MedicationSchedule = z.infer<typeof zodMedicationSchedule>;

export const MedicationScheduleSchema = new mongoose.Schema<MedicationSchedule>(
  {
    recurrence: { type: String, enum: Recurrence, required: true },
    timeOfDay: { type: Number, required: true },
    daysOfWeek: { type: [Number], required: false, default: undefined },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
  },
  { _id: false }
);

export const zodCareRecipientId = z.number();

export const zodMedication = z.object({
  name: z.string().max(256),
  schedule: zodMedicationSchedule,
  careRecipientId: zodCareRecipientId,
  completedDoses: z.array(dateStringToDate).optional(),
});

export type Medication = z.infer<typeof zodMedication>;

export const MedicationModel = mongoose.model(
  "Medication",
  new mongoose.Schema<Medication>(
    {
      name: { type: String, required: true },
      schedule: { type: MedicationScheduleSchema, required: true },
      careRecipientId: { type: Number, required: true },
      completedDoses: { type: [Date], required: false, default: [] },
    },
    { timestamps: true }
  )
);

export const zodGetCareRecipientDoses = z.object({
  careRecipientId: zodCareRecipientId,
  date: dateStringToDate,
});

export const zodAddCompletedDoseInput = z.object({
  medicationId: z.string(),
  doseDate: dateStringToDate,
});
