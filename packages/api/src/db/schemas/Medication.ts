import { z } from "zod";
import mongoose from "mongoose";
import { Recurrence } from "@homethrive-challenge/api/types";
import { normalizeDate } from "@homethrive-challenge/api/utils";
import {
  zodAddCompletedDoseInputCommon,
  zodGetCareRecipientDosesCommon,
  zodMedicationCommon,
  zodMedicationScheduleCommon,
} from "@homethrive-challenge/api/ui-safe-validator-types";

const dateStringToDate = z.preprocess(
  (arg) =>
    typeof arg === "string" || arg instanceof Date ? normalizeDate(arg) : arg,
  z.date()
);

export const zodMedicationScheduleApiOnly = z.object({
  ...zodMedicationScheduleCommon.shape,
  startDate: dateStringToDate,
  endDate: dateStringToDate.optional(),
});

export type MedicationScheduleApiOnly = z.infer<
  typeof zodMedicationScheduleApiOnly
>;

export const MedicationScheduleSchema =
  new mongoose.Schema<MedicationScheduleApiOnly>(
    {
      recurrence: { type: String, enum: Recurrence, required: true },
      timeOfDay: { type: Number, required: true },
      daysOfWeek: { type: [Number], required: false, default: undefined },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: false },
    },
    { _id: false }
  );

export const zodMedicationApiOnly = zodMedicationCommon.extend({
  completedDoses: z.array(dateStringToDate).optional(),
  schedule: zodMedicationScheduleApiOnly,
});

export type MedicationApiOnly = z.infer<typeof zodMedicationApiOnly>;

export const MedicationModel = mongoose.model(
  "Medication",
  new mongoose.Schema<MedicationApiOnly>(
    {
      name: { type: String, required: true },
      schedule: { type: MedicationScheduleSchema, required: true },
      careRecipientId: { type: Number, required: true },
      completedDoses: { type: [Date], required: false, default: [] },
      inactive: { type: Boolean, required: false, default: false },
    },
    { timestamps: true }
  )
);

export const zodGetCareRecipientDosesApiOnly =
  zodGetCareRecipientDosesCommon.extend({
    date: dateStringToDate,
  });

export const zodAddCompletedDoseInputApiOnly =
  zodAddCompletedDoseInputCommon.extend({
    doseDate: dateStringToDate,
  });
